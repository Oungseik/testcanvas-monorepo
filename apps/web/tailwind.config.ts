import containerQueries from "@tailwindcss/container-queries";
import forms from "@tailwindcss/forms";
import typography from "@tailwindcss/typography";
import type { Config } from "tailwindcss";
import daisyui from "daisyui";
import catppuccin from "@catppuccin/daisyui";

export default {
	content: ["./src/**/*.{html,js,svelte,ts}"],

	theme: {},
	extend: {},

	daisyui: {
		themes: [catppuccin("latte"), catppuccin("macchiato"), "light"]
	},
	plugins: [typography, forms, containerQueries, daisyui]
} satisfies Config;
