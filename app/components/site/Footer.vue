<template>
	<footer class="footer layout-block">

		<img ref="$logo"
			class="logo"
			src="/svgs/logo-input-idea.svg"
			alt="Input Idea" />
		<div class="footer__content layout-grid">
			<div>
				<address>
					<p class="company --yellow"><b>Input SRL</b></p>
					<p class="p-small">Via del Chionso, 28/A - 42122 – Reggio Emilia (RE) - Italia info@inputidea.it |
						+39 327 4237102
					</p>
				</address>
				<div class="socials">
					<a-link href="https://www.instagram.com/inputidea/">
						<p class="p-small">
							<span>Instagram</span>
							<ui-arrow />
						</p>
					</a-link>
					<a-link href="https://www.instagram.com/inputidea/">
						<p class="p-small">
							<span>Facebook</span>
							<ui-arrow />
						</p>
					</a-link>
					<a-link href="https://www.instagram.com/inputidea/">
						<p class="p-small">
							<span>Linkedin</span>
							<ui-arrow />
						</p>
					</a-link>
				</div>
			</div>
			<div>
				<div class="certifcations">
					<img src="/images/google-icon.png"
						alt="Google Certification" />
					<img src="/images/meta-media-icon.png"
						alt="Meta Media Certification" />
					<img src="/images/meta-digital-icon.png"
						alt="Meta Digital Certification" />
				</div>
			</div>
		</div>
		<div class="footer__copyright layout-grid">
			<div>
				<p class="p-tiny --grey-600">© 2023 Input Srl. Tutti i diritti riservati • P.IVA 02466860356 • REA: RE -
					284000 •
					PEC: input.srl@legalmail.it</p>
			</div>
			<div>
				<div class="legals">
					<a-link href="https://www.inputidea.it/privacy-policy">
						<p class="p-tiny --grey-600">Privacy Policy</p>
					</a-link>
					<a-link href="https://www.inputidea.it/privacy-policy">
						<p class="p-tiny --grey-600">Cookie Policy</p>
					</a-link>
				</div>
			</div>
		</div>
	</footer>
</template>

<script setup lang="ts">
import gsap from 'gsap/all';
import { GSAPDuration, GSAPEase } from '~/libs/constants/gsap';


const $logo = ref<HTMLImageElement | null>(null);

const initialize = () => {

	gsap.set($logo.value, {
		y: '100%',
	});
	gsap.to($logo.value, {
		y: 0,
		duration: GSAPDuration.DEFAULT,
		ease: GSAPEase.SLOW_IN_OUT,
		scrollTrigger: {
			trigger: $logo.value,
			start: 'top 100%',
			end: 'bottom 95%',
		},
	});
};

tryOnMounted(() => {
	initialize();
});
</script>

<style lang="scss" scoped>
.footer {

	position: relative;
	margin: var(--spacer-64) auto;
	overflow: hidden;

	img {
		position: relative;

		&.logo {
			width: 100%;
			height: auto;
			opacity: .025;
		}
	}

	address {
		position: relative;
		display: flex;
		flex-direction: column;
		gap: var(--spacer-8);

		p {
			text-wrap: balance;
			max-width: 640px;

			&.company {
				font-size: 17px !important;
				@include h1;
			}
		}
	}

	.socials {
		position: relative;
		margin-top: var(--spacer-32);
		display: flex;
		align-items: center;
		gap: var(--spacer-16);

		p {
			display: flex;
			align-items: center;
			gap: var(--spacer-4);
			color: var(--yellow);
			text-transform: uppercase;

			@include desktop {
				&:hover {
					text-decoration: underline;
				}
			}

			&:deep(.ui-arrow) {
				width: 10px;
				height: auto;

				svg {
					width: 100%;
					height: auto;
				}
			}
		}
	}

	.certifcations {
		position: relative;
		display: flex;
		align-items: center;

		gap: var(--spacer-8);

		@include desktop {
			justify-content: flex-end;
		}

		img {
			width: 64px;
			height: auto;
		}

	}

	&__content {
		position: relative;
		row-gap: var(--spacer-32);
		margin-top: var(--spacer-32);

		@include desktop {
			position: absolute;
			top: 0;
			left: 0;
			width: 100%;
			height: auto;
			margin-top: 0;
		}


		>div {
			grid-column: -1 / 1;

			@include desktop {
				grid-column: span 6;
				padding: var(--spacer-32);

				&:nth-child(2) {
					align-self: center;
				}
			}
		}
	}

	&__copyright {

		margin-top: var(--spacer-32);

		@include desktop {
			margin-top: var(--spacer-16);
		}

		>div {
			grid-column: -1 / 1;

			@include desktop {
				grid-column: span 6;

				&:nth-child(2) {
					justify-self: end;
				}
			}
		}

		.legals {
			position: relative;
			display: flex;
			align-items: center;
			gap: var(--spacer-8);

			p {
				text-decoration: underline;
			}
		}
	}
}
</style>
