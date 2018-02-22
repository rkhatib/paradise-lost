<template>
	<div>
		<h2>{{ name }}</h2>
		<p v-html="compiledComments">
			
		</p>
		<a to="" @click="$emit('opendetail')">Passage</a>
		<a to="" @click="$emit('openrelated')">Related</a>
	</div>
</template>

<script>
import marked from 'marked';

export default {
	name: "MapPopup",
	data: () => ({
		name: null,
		comments: null
	}), 
	computed: {
		compiledComments() { return this.comments ? marked(this.comments) : "" }
	}
}
</script>

<style lang='scss' scoped>
a {
	cursor: pointer;
	margin-right: 1rem;
}
</style>