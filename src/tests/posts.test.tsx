import Posts, { getStaticProps } from '../pages/posts';
import { render, screen } from '@testing-library/react';

import { getPrismicClient } from '../services/prismic';
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

jest.mock('next-auth/client', () => {
  return {
    useSession() {
      return [null, false];
    },
  };
});

jest.mock('../services/prismic');

const posts = [
  {
    slug: 'my-new-post-slug',
    title: 'my-new-post-title',
    excerpt: 'my-new-post-excerpt',
    updatedAt: 'my-new-post'
  }
]
describe('Posts page', () => {
  it('renders correctly', () => {
    render(
      <Posts posts={posts}></Posts>,
    );
    expect(screen.getByText('my-new-post-title')).toBeInTheDocument();
  }),
    it('loads initial data', async () => {
      const getPrismicClientMocked = mocked(getPrismicClient);
      getPrismicClientMocked.mockReturnValueOnce({
        query: jest.fn().mockResolvedValueOnce({
          results:[
            {
              uid: 'my-new-post-slug',
              data:{ 
                title: [
                  {type: "heading", text: "my-new-post-title"}
                ],
                content: [
                  {type: "paragraph", text: "my-new-post-excerpt"}
                ],
              },
              last_publication_date: "04-01-2021"
            }
          ]
        })
      }as any);
      const response = await getStaticProps({});
      expect(response).toEqual(
        expect.objectContaining({
          props: { posts: [{ slug: 'my-new-post-slug', title: 'my-new-post-title', excerpt: 'my-new-post-excerpt', updatedAt: '01 de abril de 2021' }] },
        }),
      );
    });
});
