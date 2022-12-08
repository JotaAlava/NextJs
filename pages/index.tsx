import React from 'react';
import { GetStaticProps } from 'next';
import Layout from '../components/Layout';
import Post, { PostProps } from '../components/Post';
import { PrismaClient, User } from '@prisma/client';
const prisma = new PrismaClient();

export const getStaticProps: GetStaticProps = async () => {
	const unserializableUsers: User[] = await prisma.user.findMany();
	const users = unserializableUsers.map((user) => {
		return {
			...user,
			createdAt: user.createdAt.toString(),
			updatedAt: user.updatedAt.toString()
		};
	});
	console.log(users);
	const feed = [
		{
			id: '1',
			title: 'Prisma is the perfect ORM for Next.js',
			content:
				'[Prisma](https://github.com/prisma/prisma) and Next.js go _great_ together!',
			published: false,
			author: {
				name: 'Nikolas Burk',
				email: 'burk@prisma.io'
			}
		}
	];
	return {
		props: {
			feed,
			users
		},
		revalidate: 10
	};
};

type Props = {
	feed: PostProps[];
	users: User[];
};

const Blog: React.FC<Props> = (props) => {
	return (
		<Layout>
			<div className="page">
				<h1>Public Feed</h1>
				<main>
					{JSON.stringify(props.users)}
					{props.feed.map((post) => (
						<div key={post.id} className="post">
							<Post post={post} />
						</div>
					))}
				</main>
			</div>
			<style jsx>{`
				.post {
					background: white;
					transition: box-shadow 0.1s ease-in;
				}

				.post:hover {
					box-shadow: 1px 1px 3px #aaa;
				}

				.post + .post {
					margin-top: 2rem;
				}
			`}</style>
		</Layout>
	);
};

export default Blog;
