<template>
  <div
    ref="containerRef"
    class="w-full h-full relative"
  />
</template>

<script setup lang="ts">
import * as d3 from 'd3';
import type { HeatmapCell } from '~/types/threads';

interface Props {
  data: HeatmapCell[];
}

const props = defineProps<Props>();

const containerRef = ref<HTMLElement | null>(null);

const MONTHS = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'];
const DAYS = ['日', '一', '二', '三', '四', '五', '六'];

function renderHeatmap() {
  if (!containerRef.value || !props.data.length) return;

  // Clear previous content
  d3.select(containerRef.value).selectAll('*').remove();

  const container = containerRef.value;
  const width = container.clientWidth;
  const height = container.clientHeight;

  const margin = { top: 30, right: 10, bottom: 10, left: 30 };
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  const cellWidth = innerWidth / 12;
  const cellHeight = innerHeight / 7;

  const svg = d3
    .select(container)
    .append('svg')
    .attr('width', width)
    .attr('height', height)
    .append('g')
    .attr('transform', `translate(${margin.left},${margin.top})`);

  // Create color scale
  const maxCount = d3.max(props.data, d => d.count) || 1;
  const colorScale = d3
    .scaleSequential()
    .domain([0, maxCount])
    .interpolator(d3.interpolateGreys);

  // Create data map for quick lookup
  const dataMap = new Map<string, number>();
  for (const cell of props.data) {
    dataMap.set(`${cell.month}-${cell.dayOfWeek}`, cell.count);
  }

  // Draw cells
  for (let month = 0; month < 12; month++) {
    for (let day = 0; day < 7; day++) {
      const count = dataMap.get(`${month}-${day}`) || 0;
      
      svg
        .append('rect')
        .attr('x', month * cellWidth)
        .attr('y', day * cellHeight)
        .attr('width', cellWidth - 2)
        .attr('height', cellHeight - 2)
        .attr('rx', 3)
        .attr('ry', 3)
        .attr('fill', count > 0 ? colorScale(count) : '#f5f5f5')
        .attr('stroke', '#fff')
        .attr('stroke-width', 1)
        .style('cursor', 'pointer')
        .on('mouseover', function(event) {
          d3.select(this).attr('stroke', '#000').attr('stroke-width', 2);
          
          // Get mouse position relative to container
          const containerRect = container.getBoundingClientRect();
          const mouseX = event.clientX - containerRect.left;
          const mouseY = event.clientY - containerRect.top;
          
          // Show tooltip
          d3.select(container)
            .append('div')
            .attr('class', 'heatmap-tooltip')
            .style('position', 'absolute')
            .style('background', 'rgba(0,0,0,0.9)')
            .style('color', '#fff')
            .style('padding', '8px 12px')
            .style('border-radius', '6px')
            .style('font-size', '12px')
            .style('pointer-events', 'none')
            .style('z-index', '100')
            .style('left', `${mouseX}px`)
            .style('top', `${mouseY - 45}px`)
            .html(`${MONTHS[month]} ${DAYS[day]}<br/><strong>${count} 則貼文</strong>`);
        })
        .on('mouseout', function() {
          d3.select(this).attr('stroke', '#fff').attr('stroke-width', 1);
          d3.select(container).selectAll('.heatmap-tooltip').remove();
        });
    }
  }

  // Add month labels
  svg
    .selectAll('.month-label')
    .data(MONTHS)
    .enter()
    .append('text')
    .attr('class', 'month-label')
    .attr('x', (_, i) => i * cellWidth + cellWidth / 2)
    .attr('y', -10)
    .attr('text-anchor', 'middle')
    .attr('font-size', '10px')
    .attr('fill', '#666')
    .text(d => d);

  // Add day labels
  svg
    .selectAll('.day-label')
    .data(DAYS)
    .enter()
    .append('text')
    .attr('class', 'day-label')
    .attr('x', -8)
    .attr('y', (_, i) => i * cellHeight + cellHeight / 2 + 4)
    .attr('text-anchor', 'end')
    .attr('font-size', '10px')
    .attr('fill', '#666')
    .text(d => d);
}

// Watch for data changes and resize
watch(() => props.data, renderHeatmap, { deep: true });

onMounted(() => {
  renderHeatmap();
  
  // Handle resize
  const resizeObserver = new ResizeObserver(() => {
    renderHeatmap();
  });
  
  if (containerRef.value) {
    resizeObserver.observe(containerRef.value);
  }
  
  onUnmounted(() => {
    resizeObserver.disconnect();
  });
});
</script>

<style scoped>
:deep(.heatmap-tooltip) {
  transform: translateX(-50%);
  white-space: nowrap;
}
</style>

