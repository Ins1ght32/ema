import SvgColor from 'src/components/svg-color';

// ----------------------------------------------------------------------

const icon = (name) => (
  <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />
);

const navConfig = [
  {
    title: 'dashboard',
    path: '/dashboard',
    icon: icon('ic_analytics'),
  },
  /*
  {
    title: 'user',
    path: '/user',
    icon: icon('ic_user'),
  },
  */
  {
    title: 'product',
    path: '/products',
    icon: icon('ic_product2'),
  },
  {
    title: 'Assets',
    path: '/assets',
    icon: icon('ic_asset'),
  },
  {
    title: 'Chat',
    path: '/chat',
    icon: icon('ic_chat'), // Replace with your actual icon component
  },
 /*
  {
    title: 'login',
    path: '/login',
    icon: icon('ic_lock'),
  },
  */
];

export default navConfig;
