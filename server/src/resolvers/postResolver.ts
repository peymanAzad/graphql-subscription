import { Post } from "../entities/post";
import {
	Arg,
	Mutation,
	Publisher,
	PubSub,
	Query,
	Resolver,
	Root,
	Subscription,
} from "type-graphql";

const POST_TOPIC = "POST_CREATED";

@Resolver(Post)
export class postResolver {
	@Query(() => String!)
	hello() {
		return "hello world";
	}

	@Mutation(() => Post!)
	createPost(
		@Arg("author") author: string,
		@Arg("comment") comment: string,
		@PubSub(POST_TOPIC) pubsub: Publisher<Post>
	): Post {
		const post: Post = { author, comment };
		pubsub(post);
		return post;
	}

	@Subscription(() => Post, {
		topics: POST_TOPIC,
		filter: ({ payload, args }) => {
			return payload.author === args.author;
		},
	})
	postCreated(
		@Root() newPost: Post,
		@Arg("author", { nullable: true }) _author: string
	): Post {
		return newPost;
	}
}
