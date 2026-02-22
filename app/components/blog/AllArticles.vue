<template>
	<section class="all-articles">
		<h2 v-if="blok.headline">{{ blok.headline }}</h2>

		<div v-if="articles.length" class="articles-grid">
			<article
				v-for="article in articles"
				:key="article.id"
				class="article-card"
			>
				<NuxtLink :to="`/blog/articles/${article.slug}`" class="card-link">
					<div class="image-wrapper">
						<NuxtImg
							v-if="getFeaturedImage(article)"
							:src="getFeaturedImage(article)"
							:alt="article.content.title"
							width="800"
							height="500"
							format="webp"
							quality="80"
							loading="eager"
							priority
							placeholder
							class="card-image"
						/>
						<!-- Category pill  -->
						<div v-if="getCategories(article).length" class="category-pill">
							<NuxtLink
								:to="`/blog/categories/${getCategories(article)[0].slug}`"
							>
								{{ getCategories(article)[0].name }}
							</NuxtLink>
						</div>
					</div>

					<h3 class="card-title">{{ article.content.title }}</h3>

					<!-- Author -->
					<p v-if="getAuthors(article).length" class="card-author">
						By
						<span
							v-for="(author, index) in getAuthors(article)"
							:key="author.uuid"
						>
							<NuxtLink :to="`/blog/authors/${author.slug}`">{{
								author.name
							}}</NuxtLink>
							<span v-if="(index as number) < getAuthors(article).length - 1">, </span>
						</span>
					</p>
				</NuxtLink>
			</article>
		</div>

		<p v-else>No articles found.</p>
	</section>
</template>

<script setup lang="ts">
import { useGetAllStories } from '~/libs/storyblok';

defineProps<{ blok: any }>();

const { data: articlesData } = await useGetAllStories('blog-articles', {
	starts_with: 'blog/articles/',
	sort_by: 'created_at:desc',
	resolve_relations: ['article.authors', 'article.category'],
});

const articles = computed(() => articlesData.value ?? []);

const getFeaturedImage = (article: any) => {
	const mediaBlok = article.content.featured_media?.[0];
	return mediaBlok?.image?.filename ?? '';
};

const getAuthors = (article: any) => {
	return article.content.authors ?? [];
};

const getCategories = (article: any) => {
	return article.content.category ?? [];
};
</script>

<style scoped lang="scss">
.all-articles {
	margin-bottom: var(--spacer-64);

	.articles-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
		gap: var(--spacer-32);
	}

	.article-card {
		border-radius: 4px;
		overflow: hidden;
		transition: transform 0.3s ease, box-shadow 0.3s ease;

		&:hover {
			border: 0.5px solid var(--grey);
		}
	}

	.card-link {
		display: block;
		text-decoration: none;
		color: inherit;
	}

	.image-wrapper {
		position: relative;
		overflow: hidden;
		aspect-ratio: 16 / 10;
	}

	.card-image {
		width: 100%;
		height: 100%;
		object-fit: cover;
		transition: transform 0.8s cubic-bezier(0.25, 0.8, 0.25, 1);
		transform-origin: center center;
		will-change: transform;
	}

	.article-card:hover .card-image {
		transform: scale(1.08);
	}

	.category-pill {
		position: absolute;
		top: 12px;
		left: 12px;
		background-color: rgba(0, 0, 0, 0.5);
		color: white;
		padding: 4px 12px;
		border-radius: 20px;
		font-size: 0.85rem;
		font-weight: 600;

		a {
			color: white;
			text-decoration: none;
		}
	}

	.card-title {
		margin: 16px 20px 8px;
		font-size: 1.25rem;
		font-weight: 600;
		line-height: 1.3;
	}

	.card-author {
		margin: 0 20px 20px;
		font-size: 0.9rem;
		color: #666;

		a {
			color: #333;
			text-decoration: none;

			&:hover {
				text-decoration: underline;
			}
		}
	}
}
</style>
