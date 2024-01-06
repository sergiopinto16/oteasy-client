import React, { PureComponent } from 'react';
import { BarChart, Bar, ReferenceLine, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';




class CustomizedAxisTick extends PureComponent {
  render() {
    const { x, y, stroke, payload } = this.props;

    return (
      <g transform={`translate(${x},${y})`}>
        <text x={0} y={0} dy={16} textAnchor="end" fill="#666" transform="rotate(-65)">
          {payload.value}
        </text>
      </g>
    );
  }
}



export default class GraphSPM extends PureComponent {
  static demoUrl = 'https://codesandbox.io/s/simple-bar-chart-tpz8r';

  render() {
    return (
      <BarChart
        width={this.props.width_size}
        height={600}
        // data={data}
        data = {this.props.tsQuestions_data}
        margin={{
          top: 5,
          right: 20,
          left: 20,
          bottom: 5,
          
        }}
        
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" height={200} tick={<CustomizedAxisTick />} interval = {0} />
        <YAxis type="number" domain={[0, 100]} />
        <Tooltip />
        <Legend />
        <Bar dataKey="tscore" fill="green" />
        <ReferenceLine y={60} label="Típica" stroke="red" strokeDasharray="3 3" />
        <ReferenceLine y={70} label="Disfunção Provável" stroke="blue" strokeDasharray="3 3" />
        <ReferenceLine y={80} label="Disfunção Estabelecida" stroke="yellow" strokeDasharray="3 3" />
        {/* <Bar dataKey="uv" fill="#82ca9d" /> */}
      </BarChart>

    );
  }
}
