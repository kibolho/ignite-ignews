import Post, { getServerSideProps } from '../pages/posts/[slug]';
import { render, screen } from '@testing-library/react';

import { getPrismicClient } from '../services/prismic';
import { getSession } from 'next-auth/client';
import { mocked } from 'ts-jest/utils';

jest.mock('next/router', () => {
  return {
    useRouter() {
      return {
        asPath: '/',
      };
    },
  };
});

jest.mock('next-auth/client');

jest.mock('../services/prismic');

const post = {
  slug: 'my-new-post-slug',
  title: 'my-new-post-title',
  content: '<p>my-new-post-content</p>',
  updatedAt: 'my-new-post',
};

describe('Post page', () => {
  it('renders correctly', () => {
    render(<Post post={post}></Post>);
    expect(screen.getByText('my-new-post-title')).toBeInTheDocument();
    expect(screen.getByText('my-new-post-content')).toBeInTheDocument();
  });
  it('redirects user if no subscription is found', async () => {
    const getSessionMocked = mocked(getSession);
    getSessionMocked.mockReturnValueOnce({
      activeSubscription: null,
    } as any);
    const response = await getServerSideProps({
      req: {
        cookies: {},
      },
      params: {
        slug: 'my-new-post',
      },
    } as any);
    expect(response).toEqual(
      expect.objectContaining({
        redirect: expect.objectContaining({
          destination: '/',
        }),
      }),
    );
  });
  it('loads initial data', async () => {
    const getSessionMocked = mocked(getSession);
    getSessionMocked.mockReturnValueOnce({
      activeSubscription: "fake-active-subscription",
    } as any);
    
    const getPrismicClientMocked = mocked(getPrismicClient);
    getPrismicClientMocked.mockReturnValueOnce({
      getByUID: jest.fn().mockResolvedValueOnce({
        data: {
          title: [{ type: 'heading', text: 'my-new-post-title' }],
          content: [{ type: 'paragraph', text: 'my-new-post-content' }],
        },
        last_publication_date: '04-01-2021',
      }),
    } as any);
    
    const response = await getServerSideProps({
      params: {
        slug: 'my-new-post',
      },
    } as any);

    expect(response).toEqual(
      expect.objectContaining({
        props: {
          post: {
            slug: 'my-new-post',
            title: 'my-new-post-title',
            content: '<p>my-new-post-content</p>',
            updatedAt: '01 de abril de 2021',
          },
        },
      }),
    );
  });
});
