import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
const defaultOptions =  {}
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export type Mutation = {
  __typename?: 'Mutation';
  createPost: Post;
};


export type MutationCreatePostArgs = {
  author: Scalars['String'];
  comment: Scalars['String'];
};

export type Post = {
  __typename?: 'Post';
  author: Scalars['String'];
  comment: Scalars['String'];
};

export type Query = {
  __typename?: 'Query';
  hello: Scalars['String'];
};

export type Subscription = {
  __typename?: 'Subscription';
  postCreated: Post;
};


export type SubscriptionPostCreatedArgs = {
  author?: Maybe<Scalars['String']>;
};

export type CreatePostMutationVariables = Exact<{
  author: Scalars['String'];
  comment: Scalars['String'];
}>;


export type CreatePostMutation = { __typename?: 'Mutation', createPost: { __typename?: 'Post', author: string, comment: string } };

export type PostCreatedSubscriptionVariables = Exact<{
  author?: Maybe<Scalars['String']>;
}>;


export type PostCreatedSubscription = { __typename?: 'Subscription', postCreated: { __typename?: 'Post', author: string, comment: string } };


export const CreatePostDocument = gql`
    mutation CreatePost($author: String!, $comment: String!) {
  createPost(author: $author, comment: $comment) {
    author
    comment
  }
}
    `;
export type CreatePostMutationFn = Apollo.MutationFunction<CreatePostMutation, CreatePostMutationVariables>;

/**
 * __useCreatePostMutation__
 *
 * To run a mutation, you first call `useCreatePostMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreatePostMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createPostMutation, { data, loading, error }] = useCreatePostMutation({
 *   variables: {
 *      author: // value for 'author'
 *      comment: // value for 'comment'
 *   },
 * });
 */
export function useCreatePostMutation(baseOptions?: Apollo.MutationHookOptions<CreatePostMutation, CreatePostMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreatePostMutation, CreatePostMutationVariables>(CreatePostDocument, options);
      }
export type CreatePostMutationHookResult = ReturnType<typeof useCreatePostMutation>;
export type CreatePostMutationResult = Apollo.MutationResult<CreatePostMutation>;
export type CreatePostMutationOptions = Apollo.BaseMutationOptions<CreatePostMutation, CreatePostMutationVariables>;
export const PostCreatedDocument = gql`
    subscription PostCreated($author: String) {
  postCreated(author: $author) {
    author
    comment
  }
}
    `;

/**
 * __usePostCreatedSubscription__
 *
 * To run a query within a React component, call `usePostCreatedSubscription` and pass it any options that fit your needs.
 * When your component renders, `usePostCreatedSubscription` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the subscription, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = usePostCreatedSubscription({
 *   variables: {
 *      author: // value for 'author'
 *   },
 * });
 */
export function usePostCreatedSubscription(baseOptions?: Apollo.SubscriptionHookOptions<PostCreatedSubscription, PostCreatedSubscriptionVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useSubscription<PostCreatedSubscription, PostCreatedSubscriptionVariables>(PostCreatedDocument, options);
      }
export type PostCreatedSubscriptionHookResult = ReturnType<typeof usePostCreatedSubscription>;
export type PostCreatedSubscriptionResult = Apollo.SubscriptionResult<PostCreatedSubscription>;