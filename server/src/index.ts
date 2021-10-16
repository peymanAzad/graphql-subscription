import express from "express";
import "reflect-metadata";
import { ApolloServer } from "apollo-server-express";
//import {gql} from "apollo-server-express"
import ws from "ws";
import { useServer } from "graphql-ws/lib/use/ws";
import { AMQPPubSub } from "graphql-amqp-subscriptions";
import amqp from "amqplib";
//import { makeExecutableSchema } from "@graphql-tools/schema";
//import { PubSubEngine } from "graphql-subscriptions";
import { buildSchema } from "type-graphql";
import { postResolver } from "./resolvers/postResolver";

/*const typeDefs = gql`
	type Query {
		hello: String!
	}
	type Subscription {
		postCreated: Post
	}
	type Post {
		author: String!
		comment: String!
	}
	type Mutation {
		createPost(author: String!, comment: String!): Post
	}
`;*/

/*const createResolvers = (pubsub: PubSubEngine) => ({
	Query: {
		hello: () => "hello world!",
	},
	Subscription: {
		postCreated: {
			// More on pubsub below
			subscribe: () => pubsub.asyncIterator(["POST_CREATED"]),
		},
	},
	Mutation: {
		createPost(_: any, args: any) {
			pubsub.publish("POST_CREATED", {
				postCreated: args,
			});
			return args;
		},
	},
});*/

const createPubSub = async (conn: amqp.Connection) => {
	const pubSub = new AMQPPubSub({
		connection: conn,
		exchange: {
			name: "gqlExchange",
			type: "topic",
			options: {
				durable: false,
				autoDelete: true,
			},
		},
		queue: {
			name: "gqlQeue",
			options: {
				exclusive: false,
				durable: true,
				autoDelete: true,
			},
			unbindOnDispose: false,
			deleteOnDispose: false,
		},
	});
	return pubSub;
};

const main = async () => {
	const app = express();

	const conn = await amqp.connect("amqp://localhost");
	const pubSub = await createPubSub(conn);
	//const resolvers = createResolvers(pubSub);
	//const schema = makeExecutableSchema({ typeDefs, resolvers });
	const schema = await buildSchema({ resolvers: [postResolver], pubSub });

	const apollo = new ApolloServer({
		schema,
	});
	await apollo.start();
	apollo.applyMiddleware({ app });
	const server = app.listen(4000, () => {
		const wsServer = new ws.Server({
			server,
			path: "/graphql",
		});

		useServer({ schema }, wsServer);

		console.log("server running on port 4000");
	});
};
main();
