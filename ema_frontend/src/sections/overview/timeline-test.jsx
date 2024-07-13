import PropTypes from 'prop-types';

import Card from '@mui/material/Card';
import { styled } from '@mui/material/styles';
import CardHeader from '@mui/material/CardHeader';

import Chart from 'src/components/chart'; // Assuming `useChart` is not used in this component

// ----------------------------------------------------------------------

const CHART_HEIGHT = 400;

const StyledChart = styled(Chart)(({ theme }) => ({
  height: CHART_HEIGHT,
  '& .apexcharts-canvas, .apexcharts-inner, svg, foreignObject': {
    height: `100% !important`,
  }
}));

// ----------------------------------------------------------------------

export default function TimelineChart({ title, subheader, data, ...other }) {
  const eosCount = data.reduce((acc, product) => {
    const date = product.eos_date;
    const hostnames = product.all_hostnames.split(",");
    const hostnamesCount = hostnames.length;

    if (!acc[date]) {
      acc[date] = { count: 0, products: [] };
    }
    acc[date].count += hostnamesCount;
    const productNameVersion = `${product.product_name} ${product.version_number}`
    acc[date].products.push(productNameVersion);
    return acc;
  }, {});

  const invalidDates = [
    new Date("1970-01-01").getTime(),
    new Date("9999-12-31").getTime()
  ];

  const chartData = Object.keys(eosCount).map(date => {
    let productEos = new Date(date).getTime();
    console.log(productEos);
    if (productEos === 253402185600000 || productEos === new Date("1000-01-01").getTime()) {
      productEos = new Date("2024-06-30").getTime(); // Correcting to June 30th
    }

    return {
      name: eosCount[date].products,
      data: eosCount[date].products.map((productName, index) => ({
        x: productEos,
        y: eosCount[date].count,
        // same as productName: productName -> did this to avoid annoying warning error
        productName,
      })),
    };
  }).filter(item => !invalidDates.includes(item.data[0].x));

  const chartOptions = {
    chart: {
      type: 'scatter',
      zoom: {
        enabled: true
      }
    },
    xaxis: {
      type: 'datetime',
      title: {
        text: 'End of Support Dates'
      }
    },
    yaxis: {
      title: {
        text: 'Products'
      }
    },
    tooltip: {
      x: {
        show: true
      },
      enabled: true,
      followCursor: true,
    }
  };

  return (
    <Card {...other}>
      <CardHeader title={title} subheader={subheader} sx={{ mb: 5 }} />
      <StyledChart
        type="scatter"
        series={chartData}
        options={chartOptions}
        width="100%"
        height={CHART_HEIGHT}
      />
    </Card>
  );
}

TimelineChart.propTypes = {
  chart: PropTypes.object,
  subheader: PropTypes.string,
  title: PropTypes.string,
  data: PropTypes.array.isRequired,
};
