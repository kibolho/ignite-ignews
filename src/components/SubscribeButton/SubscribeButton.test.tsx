import { fireEvent, render, screen } from '@testing-library/react';
import { signIn, useSession } from 'next-auth/client';

import { SubscribeButton } from '.';
import { mocked } from 'ts-jest/utils';
import { useRouter } from 'next/router';

jest.mock('next-auth/client');
jest.mock('next/router');

describe('SubscribeButton Component', () => {
  it('should renders correctly', () => {
    const useSessionMocked = mocked(useSession);
    useSessionMocked.mockReturnValueOnce([
      null,
      false,
    ]);
    const useRouterMocked = mocked(useRouter);
    const pushMock = jest.fn();
    useRouterMocked.mockReturnValueOnce({
      push: pushMock,
    } as any);
    render(<SubscribeButton />);
    expect(screen.getByText('Subscribe now')).toBeInTheDocument();
  });
  
  it('redirects user to sign in when not authenticated', () => {
    const useSessionMocked = mocked(useSession);
    useSessionMocked.mockReturnValueOnce([
      null,
      false,
    ]);
    const signInMocked = mocked(signIn);
    const useRouterMocked = mocked(useRouter);
    const pushMock = jest.fn();
    useRouterMocked.mockReturnValueOnce({
      push: pushMock,
    } as any);
    render(<SubscribeButton />);
    const subscribeButton = screen.getByText('Subscribe now');
    fireEvent.click(subscribeButton);
    expect(signInMocked).toHaveBeenCalled();
  });
  
  it('redirects user to post when user already has a subscription', () => {
    const useRouterMocked = mocked(useRouter);
    const pushMock = jest.fn();
    useRouterMocked.mockReturnValueOnce({
      push: pushMock,
    } as any);
    
    const useSessionMocked = mocked(useSession);
    useSessionMocked.mockReturnValueOnce([
      {
        user:{
          name:'John Doe',
          email: 'teste@email.com',
        },
        expires: 'fake-expires',
        activeSubscription: 'true'
      },
      false,
    ]);
    
    render(<SubscribeButton />);
    const subscribeButton = screen.getByText('Subscribe now');
    fireEvent.click(subscribeButton);
    expect(pushMock).toHaveBeenCalled();
  });
});
