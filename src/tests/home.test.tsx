import Home, { getStaticProps } from '../pages';
import { render, screen } from '@testing-library/react';

import { mocked } from 'ts-jest/utils';
import { stripe } from '../services/stripe';

jest.mock('next/router', () => {
  return {
    useRouter() {
      return {
        asPath: '/',
      };
    },
  };
});

jest.mock('next-auth/client', () => {
  return {
    useSession() {
      return [null, false];
    },
  };
});

jest.mock('../services/stripe');

describe('Home page', () => {
  it('renders correctly', () => {
    render(
      <Home product={{ priceId: 'fake-price-id', amount: 'R$10,00' }}></Home>,
    );
    expect(screen.getByText('for R$10,00 month')).toBeInTheDocument();
  }),
    it('loads initial data', async () => {
      const retriveStripPricesMocked = mocked(stripe.prices.retrieve);
      retriveStripPricesMocked.mockResolvedValueOnce({
        id: 'fake-price-id',
        unit_amount: 1000,
      } as any);
      const response = await getStaticProps({});
      expect(response).toEqual(
        expect.objectContaining({
          props: { product: { amount: '$10.00', productId: 'fake-price-id' } },
        }),
      );
    });
});
