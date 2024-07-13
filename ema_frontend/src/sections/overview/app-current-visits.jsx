import PropTypes from 'prop-types';

import Card from '@mui/material/Card';
import { styled } from '@mui/material/styles';
import CardHeader from '@mui/material/CardHeader';

import { fNumber } from 'src/utils/format-number';

import Chart, { useChart } from 'src/components/chart';

// ----------------------------------------------------------------------

const CHART_HEIGHT = 400;

const LEGEND_HEIGHT = 72;

const StyledChart = styled(Chart)(({ theme }) => ({
  height: CHART_HEIGHT,
  '& .apexcharts-canvas, .apexcharts-inner, svg, foreignObject': {
    height: `100% !important`,
  },
  '& .apexcharts-legend': {
    height: LEGEND_HEIGHT,
    borderTop: `dashed 1px ${theme.palette.divider}`,
    top: `calc(${CHART_HEIGHT - LEGEND_HEIGHT}px) !important`,
  },
}));

// ----------------------------------------------------------------------

export default function AppCurrentVisits({ title, subheader, data, ...other }) {

  const chartSeries_test = {
    series: data,
  };

  const { series, options } = chartSeries_test;

  const chartSeries_data = series.map((i) => i.value);

  console.log(chartSeries_data);
  

  const chartOptions = useChart({
    chart: {
      sparkline: {
        enabled: true,
      },
    },
    colors: ['#FF0000', '#FF5F1F', '#FFFF00', '#008000', '#69757a', '#1f2629'],
    labels: series.map((i) => i.label),
    fill: {
      colors: ['#FF0000', '#FF5F1F', '#FFFF00', '#008000', '#69757a', '#1f2629'],
    },
    stroke: {
      colors: ['#FF0000', '#FF5F1F', '#FFFF00', '#008000', '#69757a', '#1f2629'],
    },
    legend: {
      floating: true,
      position: 'bottom',
      horizontalAlign: 'center',
    },
    dataLabels: {
      enabled: true,
      dropShadow: {
        enabled: true,
      },
    },
    tooltip: {
      fillSeriesColor: true,
      y: {
        formatter: (value) => fNumber(value),
        title: {
          formatter: (seriesName) => `${seriesName}`,
        },
      },
    },
    plotOptions: {
      pie: {
        donut: {
          labels: {
            show: false,
          },
        },
      },
    },
    ...options,
  });

  return (
    <Card {...other}>
      <CardHeader title={title} subheader={subheader} sx={{ mb: 5 }} />

      <StyledChart
        dir="ltr"
        type="pie"
        series={chartSeries_data}
        options={chartOptions}
        width="100%"
        height={280}
      />
    </Card>
  );
}

AppCurrentVisits.propTypes = {
  chart: PropTypes.object,
  subheader: PropTypes.string,
  title: PropTypes.string,
  data: PropTypes.array.isRequired,
};
