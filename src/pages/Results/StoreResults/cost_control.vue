<!-- d3js 气泡图 -->
<template>
	<div id="bubble" style="width: 500px;height:500px"></div>
</template>

<script>
	import * as echarts from 'echarts/core';
	import {
		DatasetComponent,
		TooltipComponent,
		VisualMapComponent
	} from 'echarts/components';
	import { CustomChart } from 'echarts/charts';
	import { CanvasRenderer } from 'echarts/renderers';
	echarts.use([
		DatasetComponent,
		TooltipComponent,
		VisualMapComponent,
		CustomChart,
		CanvasRenderer
		]);
	import * as d3 from 'd3';
	export default {
		data() {
			return {
				option: {},
				colorList: ['#5470c6', '#91cc75', '#fac858', '#ee6666', '#73c0de', '#3ba272', '#fc8452', '#9a60b4', '#ea7ccc'],
				seriesData:[{
					id: 'option',
					name:'第一个',
					value: 0
				},{
					id: 'option.第二个',
					name:'第二个',
					value: 6748
				},{
					id: 'option.第三个',
					name:'第三个',
					value: 7635
				},{
					id: 'option.第四个',
					name:'第四个',
					value: 8746
				},{
					id: 'option.第五个',
					name:'第五个',
					value: 9834
				}]
			};
		},

		mounted() {
			this.initEcharts()
		},
		methods: {
			initEcharts() {
				let myChart = echarts.init(document.getElementById('bubble'))
				myChart.setOption(this.setChartOptions())
			},
			//圆形图表配置
			setChartOptions(){
				return {
					dataset: {
						source: this.seriesData
					},
					tooltip: {},
					series: [{
						type: 'custom',
						colorBy: 'data',
						renderItem: this.renderItem,
						coordinateSystem: 'none',
						encode: {
							tooltip: 'value',
							itemName: 'name'
						}
					}]
				}
			},
			renderItem(params, api) {
				let context = params.context;
				let idx = params.dataIndex;
				if (!context.layout) {
					context.layout = true;
					this.overallLayout(params, api);
				}
				let id = api.value('id');
				let name = api.value('name');
				let value = api.value('value');
				let node = context.nodes[id];
				if (node.id === 'option') {
					node.r = 0
				}
				if (!node) {
					return;
				}
				return {
					type: 'circle',
					shape: {
						cx: node.x,
						cy: node.y,
						r: node.r
					},
					textContent: {
						type: 'text',
						style: {
							text: value > 10?name + '\n' + value:'',
							fill: '#fff',
							fontFamily: 'Arial',
							width: node.r * 1.3,
							overflow: 'truncate',
							fontSize: node.r / 6
						}
					},
					textConfig: {
						position: 'inside'
					},
					style: {
						fill: this.colorList[idx % this.colorList.length]
					},
					emphasis: {
						style: {
							fontFamily: 'Arial',
							fontSize: 12,
							shadowBlur: 20,
							shadowOffsetX: 3,
							shadowOffsetY: 5,
							shadowColor: 'rgba(0,0,0,0.3)'
						}
					}
				};
			},
			overallLayout(params, api) {
				let displayRoot = this.stratify1();
				let context = params.context;
				d3.pack().size([api.getWidth() - 2, api.getHeight() - 2]).padding(0)(displayRoot);
				context.nodes = {};
				displayRoot.descendants().forEach(function (node) {
					context.nodes[node.id] = node;
				});
			},
			stratify1() {
				return d3.stratify().parentId(function (d) {
					return d.id.substring(0, d.id.lastIndexOf('.'));
				})(this.seriesData).sum(function (d) {
					return d.value || 0;
				}).sort(function (a, b) {
					return b.value - a.value;
				});
			}
		}
	}

</script>

