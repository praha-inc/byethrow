import { useI18n } from '@rspress/core/runtime';
import { useEffect, useRef, useState } from 'react';

import { FlowStepText } from './flow-step-text';
import { caseKey, FLOWS, formatValue, laneLabel } from './flows';
import { ResultFlowMarkdown } from './result-flow-markdown';
import styles from './result-flow.module.css';
import { usePlaying } from '../../../hooks/use-playing';

import type { Flow, FlowCase, FlowName, FlowValue, Lane } from './flows';
import type I18nJson from 'i18n';
import type { FC } from 'react';

const cx = (...names: Array<string | undefined | false>): string => names.filter(Boolean).join(' ');

const TRACKS: readonly [Lane, Lane] = ['success', 'failure'];

/*
 * Layout in viewBox units: chips on the left where values enter, chips on the right
 * where they leave, each at the height of the top or bottom lane, and the box in
 * the middle.
 */
const WIDTH = 420;
const HEIGHT = 130;
const TOP_Y = 30;
const BOTTOM_Y = 100;
const MIDDLE_Y = (TOP_Y + BOTTOM_Y) / 2;
/** Where the first and last of several inputs enter. */
const INPUTS_TOP = 20;
const INPUTS_BOTTOM = HEIGHT - 20;
const CHIP_WIDTH = 64;
const CHIP_HEIGHT = 24;
const RAIL_START = CHIP_WIDTH + 2;
const RAIL_END = WIDTH - CHIP_WIDTH - 2;
const BOX_X = WIDTH / 2;
const BOX_HEIGHT = 28;
/** Horizontal distance a line takes to move to another height. */
const CROSSING = 64;

const DOT_RADIUS = 9;
/** Space kept between a dot and the chips at either end. */
const DOT_GAP = 4;

const TRAVEL_MS = 2200;
const HOLD_MS = 800;
const FADE_IN_MS = 150;
const FADE_OUT_MS = 300;

const boxWidthOf = (label: string): number => Math.max(60, label.length * 8 + 20);

const entriesOf = ({ entries }: Flow): readonly Lane[] => entries ?? TRACKS;
const exitsOf = ({ exits }: Flow): readonly Lane[] => exits ?? TRACKS;

/** The first of two lanes runs at the top and the second at the bottom, while a lone lane runs through the middle. */
const laneYOf = (lanes: readonly Lane[], lane: Lane): number => {
  if (lanes.length === 1) return MIDDLE_Y;
  return lanes[0] === lane ? TOP_Y : BOTTOM_Y;
};

const boxYOf = (flow: Flow): number => (flow.side === 'both' ? MIDDLE_Y : laneYOf(entriesOf(flow), flow.side));

/** Where the input at `index` enters when the box takes several. */
const slotYOf = (index: number, count: number): number => INPUTS_TOP + ((INPUTS_BOTTOM - INPUTS_TOP) * index) / (count - 1);

/** A single input enters on its lane, while several have a slot each whose track varies by case. */
const entryYOf = (flow: Flow, { track }: FlowValue, index: number, count: number): number => {
  return count === 1 ? laneYOf(entriesOf(flow), track) : slotYOf(index, count);
};

/** A horizontal line that moves from `y1` to `y2` with a bend starting at `bendX`. */
const line = (x1: number, y1: number, x2: number, y2: number, bendX: number): string => {
  if (y1 === y2) return `M${x1} ${y1} H${x2}`;
  const middle = bendX + CROSSING / 2;
  return `M${x1} ${y1} H${bendX} C${middle} ${y1}, ${middle} ${y2}, ${bendX + CROSSING} ${y2} H${x2}`;
};

type Route = {
  /** One path for each input, ending at the centre of the box where the carried value changes. */
  enter: readonly string[];
  leave: string;
};

const routeOf = (flow: Flow, { inputs, output }: FlowCase): Route => {
  const { box, side } = flow;
  const half = boxWidthOf(box) / 2;
  const enter = inputs.map((value, index) => {
    const y = entryYOf(flow, value, index, inputs.length);
    // A box on a lane is reached along that lane, while one between the lanes draws every input to its height.
    return line(RAIL_START, y, BOX_X, side === 'both' ? MIDDLE_Y : y, BOX_X - half - CROSSING);
  });
  const first = inputs[0];
  const leaveY = side === 'both' || !first ? MIDDLE_Y : entryYOf(flow, first, 0, 1);

  return { enter, leave: line(BOX_X, leaveY, RAIL_END, laneYOf(exitsOf(flow), output.track), BOX_X + half) };
};

/** Whether the box is reached in this case, rather than passed by on the other lane. */
const callsBox = ({ side }: Flow, { inputs }: FlowCase): boolean => side === 'both' || inputs[0]?.track === side;

const easeInOut = (t: number): number => (1 - Math.cos(Math.PI * t)) / 2;

const labelOf = ({ value, dot }: FlowValue): string => dot ?? value;

/** Puts `label` on a dot, widening it to fit, and returns the dot's width. */
const labelDot = (dot: SVGGElement, label: string): number => {
  const rect = dot.querySelector('rect');
  const text = dot.querySelector('text');
  if (!rect || !text) return DOT_RADIUS * 2;

  if (text.textContent !== label) {
    text.textContent = label;
    const width = Math.max(DOT_RADIUS * 2, text.getComputedTextLength() + 10);
    rect.setAttribute('x', String(-width / 2));
    rect.setAttribute('width', String(width));
  }
  return Number(rect.getAttribute('width'));
};

const moveDot = (dot: SVGGElement, point: DOMPoint | undefined, value: FlowValue | undefined, opacity: number): void => {
  if (!point || !value) {
    dot.style.opacity = '0';
    return;
  }

  labelDot(dot, labelOf(value));
  dot.setAttribute('transform', `translate(${point.x} ${point.y})`);
  dot.dataset['track'] = value.track;
  dot.style.opacity = String(opacity);
};

/** How far from a chip the centre of a dot carrying `value` has to stay. */
const insetOf = (dot: SVGGElement | undefined, value: FlowValue | undefined): number => {
  const width = dot && value ? labelDot(dot, labelOf(value)) : DOT_RADIUS * 2;
  return width / 2 + DOT_GAP;
};

type ChipProps = {
  /** What the chip stands for, or none for an input whose track is not known yet. */
  kind: Lane | undefined;
  x: number;
  y: number;
  muted: boolean;
};

const Chip: FC<ChipProps> = ({ kind, x, y, muted }) => (
  <g className={cx(styles['chip'], styles[`chip--${kind ?? 'neutral'}`], muted && styles['chip--muted'])}>
    <rect x={x} y={y - CHIP_HEIGHT / 2} width={CHIP_WIDTH} height={CHIP_HEIGHT} rx="8" />
    <text x={x + CHIP_WIDTH / 2} y={y} dy="0.35em" textAnchor="middle">
      {kind ? laneLabel(kind) : 'Result'}
    </text>
  </g>
);

export type ResultFlowProps = {
  /** The function whose flow is drawn. */
  fn: FlowName;
};

/**
 * The tracks of Results going through one function. Dots follow each case in turn
 * and the matching row of the list below lights up; pointing at or selecting a row
 * follows that case only.
 */
export const ResultFlow: FC<ResultFlowProps> = ({ fn }) => {
  const t = useI18n<typeof I18nJson>();
  const flow: Flow = FLOWS[fn];
  const { cases, side } = flow;
  const slots = Math.max(...cases.map(({ inputs }) => inputs.length));
  const figureRef = useRef<HTMLElement>(null);
  const dotRefs = useRef<Array<SVGGElement | null>>([]);
  const enterRefs = useRef<Array<SVGPathElement | null>>([]);
  const leaveRef = useRef<SVGPathElement>(null);
  const playing = usePlaying(figureRef);
  const [auto, setAuto] = useState(0);
  const [hovered, setHovered] = useState<number | null>(null);
  const [pinned, setPinned] = useState<number | null>(null);
  const chosen = hovered ?? pinned;
  const current = chosen ?? (playing ? auto : null);

  useEffect(() => {
    const dots = dotRefs.current.filter((dot) => dot !== null);
    const flowCase = current === null ? undefined : cases[current];
    const leave = leaveRef.current;
    if (!playing || !flowCase || !leave) {
      for (const dot of dots) dot.style.opacity = '0';
      return;
    }

    const enterLengths = flowCase.inputs.map((_, index) => enterRefs.current[index]?.getTotalLength() ?? 0);
    const enterLength = Math.max(...enterLengths);
    const leaveLength = leave.getTotalLength();
    // Dots widen to fit their labels, so keep each end of the trip clear of the chips by half the dot's width.
    const startInset = Math.max(...flowCase.inputs.map((value, index) => insetOf(dots[index], value)));
    const endInset = insetOf(dots[0], flowCase.output);
    const span = enterLength + leaveLength - startInset - endInset;
    let start: number | undefined;
    let frame = 0;

    const tick = (now: number) => {
      start ??= now;
      const elapsed = now - start;
      const travelled = startInset + easeInOut(Math.min(elapsed / TRAVEL_MS, 1)) * span;
      const opacity = Math.max(0, Math.min(1, elapsed / FADE_IN_MS, (TRAVEL_MS + HOLD_MS - elapsed) / FADE_OUT_MS));

      for (const [index, dot] of dots.entries()) {
        if (travelled < enterLength) {
          // Every input reaches the box at the same moment, however long its path.
          const ratio = travelled / enterLength;
          const point = enterRefs.current[index]?.getPointAtLength(ratio * (enterLengths[index] ?? 0));
          moveDot(dot, point, flowCase.inputs[index], opacity);
        } else {
          const point = index === 0 ? leave.getPointAtLength(travelled - enterLength) : undefined;
          moveDot(dot, point, flowCase.output, opacity);
        }
      }

      if (elapsed < TRAVEL_MS + HOLD_MS) {
        frame = requestAnimationFrame(tick);
      } else if (chosen === null) {
        setAuto((index) => (index + 1) % cases.length);
      } else {
        start = undefined;
        frame = requestAnimationFrame(tick);
      }
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [cases, current, chosen, playing]);

  if (import.meta.env.SSG_MD) {
    return <ResultFlowMarkdown fn={fn} />;
  }

  const active = current === null ? undefined : cases[current];
  const activeRoute = active && routeOf(flow, active);
  const boxWidth = boxWidthOf(flow.box);
  const boxCalled = active && callsBox(flow, active);
  // A single input has a chip per lane, while several have one per slot that shows its track in the active case.
  const entryChips = slots > 1
    ? Array.from({ length: slots }, (_, index) => (
        <Chip key={index} kind={active?.inputs[index]?.track} x={RAIL_START - CHIP_WIDTH} y={slotYOf(index, slots)} muted={false} />
      ))
    : entriesOf(flow).map((lane, _, lanes) => (
        <Chip key={lane} kind={lane} x={RAIL_START - CHIP_WIDTH} y={laneYOf(lanes, lane)} muted={!!active && active.inputs[0]?.track !== lane} />
      ));

  return (
    <figure ref={figureRef} className={cx('rp-not-doc', styles['figure'])}>
      <figcaption className={styles['header']}>
        <code className={styles['name']}>{flow.signature}</code>
        <span className={styles['hint']}>{t('resultFlow.hint')}</span>
      </figcaption>
      <svg className={styles['svg']} viewBox={`0 0 ${WIDTH} ${HEIGHT}`} aria-hidden="true">
        {cases.map((flowCase) => {
          const { enter, leave } = routeOf(flow, flowCase);
          return (
            <g key={caseKey(flowCase)} className={active ? styles['routes--muted'] : undefined}>
              {enter.map((path, index) => (
                <path
                  key={path}
                  className={cx(styles['route'], styles[`route--${slots > 1 ? 'neutral' : flowCase.inputs[index]?.track}`])}
                  d={path}
                />
              ))}
              <path className={cx(styles['route'], styles[`route--${flowCase.output.track}`])} d={leave} />
            </g>
          );
        })}
        {active && activeRoute && (
          <g className={styles['routes--active']}>
            {activeRoute.enter.map((path, index) => (
              <path
                key={index}
                ref={(element) => {
                  enterRefs.current[index] = element;
                }}
                className={cx(styles['route'], styles[`route--${active.inputs[index]?.track}`])}
                d={path}
              />
            ))}
            <path ref={leaveRef} className={cx(styles['route'], styles[`route--${active.output.track}`])} d={activeRoute.leave} />
          </g>
        )}
        {entryChips}
        {exitsOf(flow).map((lane, _, lanes) => (
          <Chip key={lane} kind={lane} x={RAIL_END} y={laneYOf(lanes, lane)} muted={!!active && active.output.track !== lane} />
        ))}
        {Array.from({ length: slots }, (_, index) => (
          <g
            key={index}
            ref={(element) => {
              dotRefs.current[index] = element;
            }}
            className={styles['dot']}
          >
            <rect x={-DOT_RADIUS} y={-DOT_RADIUS} width={DOT_RADIUS * 2} height={DOT_RADIUS * 2} rx={DOT_RADIUS} />
            <text dy="0.35em" textAnchor="middle" />
          </g>
        ))}
        <g
          className={cx(
            styles['box'],
            styles[`box--${side}`],
            active && (boxCalled ? styles['box--called'] : styles['box--skipped']),
          )}
        >
          <rect x={BOX_X - boxWidth / 2} y={boxYOf(flow) - BOX_HEIGHT / 2} width={boxWidth} height={BOX_HEIGHT} rx="8" />
          <text x={BOX_X} y={boxYOf(flow)} dy="0.35em" textAnchor="middle">{flow.box}</text>
        </g>
      </svg>
      <ol className={styles['cases']}>
        {cases.map((flowCase, index) => (
          <li key={caseKey(flowCase)}>
            <button
              type="button"
              className={cx(styles['case'], index === current && styles['case--active'])}
              aria-pressed={index === pinned}
              onClick={() => setPinned((value) => (value === index ? null : index))}
              onPointerEnter={(event) => {
                if (event.pointerType === 'mouse') setHovered(index);
              }}
              onPointerLeave={() => setHovered(null)}
            >
              <span className={styles['inputs']}>
                {flowCase.inputs.length > 1 && <span className={styles['bracket']}>[</span>}
                {flowCase.inputs.map((value, inputIndex) => (
                  <span
                    key={inputIndex}
                    className={cx(styles['value'], styles[`value--${value.track}`])}
                  >
                    {formatValue(value)}
                  </span>
                ))}
                {flowCase.inputs.length > 1 && <span className={styles['bracket']}>]</span>}
              </span>
              <span className={styles['step']}>
                <FlowStepText step={flowCase.step} />
              </span>
              <span className={styles['arrow']} aria-hidden="true">→</span>
              <span className={cx(styles['value'], styles[`value--${flowCase.output.track}`])}>
                {formatValue(flowCase.output)}
              </span>
            </button>
          </li>
        ))}
      </ol>
    </figure>
  );
};
