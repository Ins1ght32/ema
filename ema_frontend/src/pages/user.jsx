import React from 'react';
import { Helmet } from 'react-helmet-async';

export default function Dashboard() {
  return (
    <>
      <Helmet>
        <title>Dashboard - EMA EOS Dashboard</title>
      </Helmet>
      <div style={styles.container}>
        <h1>Welcome to the Dashboard</h1>
      </div>
    </>
  );
}

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    background: 'linear-gradient(135deg, #cfd9df 0%, #e2ebf0 100%)',
    flexDirection: 'column',
  },
};
