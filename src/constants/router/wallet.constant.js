const routes = Object.freeze({
  ROOT_NAME: 'Wallet',
  ROOT_PATH: '/wallet',
  ROOT_META: { isAuthRequired: true },

  BALANCE_NAME: 'WalletBalance',
  BALANCE_PATH: '',
  BALANCE_COMPONENT: () => import('@/views/wallet/Wallet.view.vue'),
  BALANCE_META: { isAuthRequired: true },
});

export default routes;
