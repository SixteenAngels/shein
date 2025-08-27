import React from 'react';
import BuyNowModal from './BuyNowModal';

type Props = { route: any; navigation: any };

export default function BuyNowScreen({ route, navigation }: Props) {
  const { product } = route.params || {};
  return <BuyNowModal product={product} onClose={() => navigation.goBack()} />;
}

