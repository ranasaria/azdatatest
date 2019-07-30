/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the Source EULA. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
/**
 * This module contains all the definitions for drawing charts and writing them to a file.
*/
import { CanvasRenderService, MimeType } from 'chartjs-node-canvas';
import { ChartConfiguration } from 'chart.js';
import { Color } from 'color';

const logPrefix = 'adstest:counters:charts';
const debug = require('debug')(logPrefix);

/**
 *
 *
 * @export
 * @interface LineData
 */
export interface LineData {
	label: string,
	data: number[]
}

/**
 *
 *
 * @export
 * @param {any[]} xData - array of labels (the x - coordinates/labels of the points)
 * @param {LineData[]} lines - array of {@link LineData} objects
 * @param {string} [fileType='png'] - supported values are 'png' or 'jpeg'. 'jpg' is considered synonym of 'jpeg'
 * @param {string} file - the file name to write out for the generated chart
 * @returns {Promise<void>}
 */
export async function writeChartToFile(xData: any[], lines: LineData[], fileType: string = 'png', xAxisLabel: string = 'elapsed(ms)', file: string = null, title: string = null): Promise<Buffer> {
	const configuration: ChartConfiguration = {
		// See https://www.chartjs.org/docs/latest/configuration        
		type: 'line',
		options: {
			title: {
				display: !!(title), //display if title is defined. !! converts title to a boolean value
				fontColor: 'Red',
				fontStyle: 'Bold',
				fontSize: 50,
				position: 'bottom',
				text: title
			},	
			scales: {
				xAxes: [{
					gridLines: {
						lineWidth: 10
					},
					display: true,
					scaleLabel: {
						display: true,
						labelString: xAxisLabel
					  },
				}],				
				yAxes: [{
					ticks: {
						// Include a % sign in the ticks on y-axis
						callback: function(value, index, values) {
							return value + '%';
						}
					},
					gridLines: {
						lineWidth: 10
					},
					max: 130
				}]
			},
		},
		data: {
			labels: xData,
			datasets: [],
		}
	};
	debug("lines.length:", lines.length);	
	const randomColor = require('randomcolor');
	const rColors: Color[] = randomColor({
		luminosity: 'bright', 
		format: 'rgb', 
		count: lines.length, 
		seed: 5
	});
	const colors: Color[] = rColors.map(rc => require('color')(rc));
	for (const [index, line] of lines.entries()) {
		let min: number = Math.min(...line.data);
		let max: number = Math.max(...line.data);
		let data = line.data;
		let label = line.label;		
		if (min == max)	{
			// please it a random location between 0 and 100, but we move it same amount up and down so find a random number between 0 and 50 to adjust min and max by that amount
			const randomShift = Math.ceil(Math.random()*50);
			label = `${line.label}:${randomShift.toPrecision(3)}%=${min} & zero at:0`;
			data = line.data.map(y => randomShift);
		} else {
			label = `${line.label}:1%=${((max-min)/100).toPrecision(3)} & zero at:${min.toPrecision(3)}`;
			data = line.data.map(y => (y-min)*100/(max-min));
		}
		const color: Color = colors[index];
		configuration.data.datasets.push({
			fill: false,
			borderColor: `${color}`,
			backgroundColor: `${color.alpha(0.7)}`,			
			borderWidth: 4,
			pointRadius: 6,
			pointBackgroundColor: '#fff', // white
			label: label, // include the scaling factor in the label
			data: data, //convert y values to percentages
		});
	}
	const width = 1600; //px
	const height = 900; //px
	const canvasRenderService = new CanvasRenderService(width, height, (ChartJS) => {
		ChartJS.defaults.global.elements.line.fill = true;
		ChartJS.defaults.line.spanGaps = true;
		ChartJS.defaults.global.defaultFontColor = 'black';
		ChartJS.defaults.global.defaultFontStyle = 'bold';
		ChartJS.defaults.global.defaultFontSize = 16;
	});
	const mimeType: MimeType = getMimeType(fileType);
	const image: Buffer = await canvasRenderService.renderToBuffer(configuration, mimeType);	
	if (file) {
		const fs = require('fs');
		let fd;		
		try {
			fd = fs.openSync(file, 'w');
			fs.writeSync(fd, image);
			debug(`The chart file:${file} was written out.`);	
		} finally {
			fs.closeSync(fd);
		}
	}
	return image;
}

function getMimeType(fileType: string): MimeType {
	switch (fileType.toLowerCase()) {
		case 'jpeg':
		case 'jpg':
			return 'image/jpeg';
		case 'png':
		default:
			return 'image/png';
	}
}

