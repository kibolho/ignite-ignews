import { ActiveLink } from '.';
import { render } from '@testing-library/react';

jest.mock('next/router', () => {
  return {
    useRouter() {
      return {
        asPath: '/',
      };
    },
  };
});

describe('ActiveLink Component', () => {
  it('should renders correctly', () => {
    const { getByText } = render(
      <ActiveLink href="/" activeClassName="active">
        <a>Home</a>
      </ActiveLink>,
    );
    expect(getByText("Home")).toBeInTheDocument();
  });

  it('is receiving active class', () => {
    const { getByText } = render(
      <ActiveLink href="/" activeClassName="active">
        <a>Home</a>
      </ActiveLink>,
    );
    expect(getByText("Home")).toHaveClass("active");
  });
})