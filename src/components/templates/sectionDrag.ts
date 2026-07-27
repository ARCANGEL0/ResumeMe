import { useSyncExternalStore } from 'react';
import type { TemplateLayoutEditor } from './templateComponents';

export interface DropTarget {
  regionKey: string;
  index: number;
}

let hoverKey = '';
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function getSnapshot() {
  return hoverKey;
}

function setHover(target: DropTarget | null) {
  const next = target ? `${target.regionKey}:${target.index}` : '';
  if (next === hoverKey) return;
  hoverKey = next;
  emit();
}

export function useHoverKey() {
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}

export function isZoneHovered(hover: string, regionKey: string, index: number) {
  return hover === `${regionKey}:${index}`;
}

export function isRegionHovered(hover: string, regionKey: string) {
  return hover.startsWith(`${regionKey}:`);
}

function resolveTarget(x: number, y: number): DropTarget | null {
  const element = document.elementFromPoint(x, y);
  if (!element) return null;

  const zone = element.closest<HTMLElement>('[data-drop-zone]');
  if (zone?.dataset.region) {
    return { regionKey: zone.dataset.region, index: Number(zone.dataset.index ?? 0) };
  }

  const region = element.closest<HTMLElement>('[data-drop-region]');
  if (region?.dataset.region) {
    return { regionKey: region.dataset.region, index: Number(region.dataset.count ?? 0) };
  }

  return null;
}

const DRAG_THRESHOLD = 4;

export function beginSectionDrag(
  event: React.PointerEvent<HTMLDivElement>,
  layoutEditor: TemplateLayoutEditor,
  regionKey: string,
  sectionId: string,
) {
  if (event.button !== 0 || event.pointerType !== 'mouse') return;

  event.preventDefault();

  const startX = event.clientX;
  const startY = event.clientY;
  let started = false;

  const handleMove = (moveEvent: PointerEvent) => {
    if (!started) {
      const dx = moveEvent.clientX - startX;
      const dy = moveEvent.clientY - startY;
      if (Math.sqrt(dx * dx + dy * dy) < DRAG_THRESHOLD) return;
      started = true;
      layoutEditor.onDragStart(regionKey, sectionId);
    }
    setHover(resolveTarget(moveEvent.clientX, moveEvent.clientY));
  };

  const finish = (upEvent: PointerEvent) => {
    window.removeEventListener('pointermove', handleMove);
    window.removeEventListener('pointerup', finish);
    window.removeEventListener('pointercancel', cancel);

    if (started) {
      const target = resolveTarget(upEvent.clientX, upEvent.clientY);
      if (target) {
        layoutEditor.onDrop(regionKey, target.regionKey, sectionId, target.index);
      }
      layoutEditor.onDragEnd();
    }
    setHover(null);
  };

  const cancel = () => {
    window.removeEventListener('pointermove', handleMove);
    window.removeEventListener('pointerup', finish);
    window.removeEventListener('pointercancel', cancel);
    if (started) layoutEditor.onDragEnd();
    setHover(null);
  };

  window.addEventListener('pointermove', handleMove);
  window.addEventListener('pointerup', finish);
  window.addEventListener('pointercancel', cancel);
}
