import PostPreview, { getStaticProps } from '../pages/posts/preview/[slug]';
import { render, screen } from '@testing-library/react';

import { getPrismicClient } from '../services/prismic';
import { mocked } from 'ts-jest/utils';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/client';

jest.mock('next/router');
jest.mock('next-auth/client');
jest.mock('../services/prismic');

const post = {
  slug: 'my-new-post-slug',
  title: 'my-new-post-title',
  content: '<p>my-new-post-content</p>',
  updatedAt: 'my-new-post',
};

describe('Post Preview page', () => {
  it('renders correctly', () => {
    const useRouterMocked = mocked(useRouter);
    useRouterMocked.mockReturnValueOnce({
      push: jest.fn(),
    } as any);
    const useSessionMocked = mocked(useSession);
    useSessionMocked.mockReturnValueOnce([
      null,
      false,
    ]);
    render(<PostPreview post={post}/>);
    expect(screen.getByText('my-new-post-title')).toBeInTheDocument();
    expect(screen.getByText('my-new-post-content')).toBeInTheDocument();
    expect(screen.getByText('Wanna continue reading?')).toBeInTheDocument();
  });
  it('redirects user to full post when user is subscribed', async () => {
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
    const useRouterMocked = mocked(useRouter);
    const pushMock = jest.fn();
    useRouterMocked.mockReturnValueOnce({
      push: pushMock,
    } as any);
    render(<PostPreview post={post}></PostPreview>);
    expect(pushMock).toHaveBeenCalledWith(`/posts/${post.slug}`);

  
  });
  it('loads initial data', async () => {    
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
    
    const response = await getStaticProps({
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
