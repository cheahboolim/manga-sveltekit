<script lang="ts">
	import { enhance } from '$app/forms';
	import { invalidateAll } from '$app/navigation';
	import type { PageData } from './$types';

	export let data: PageData;

	// Reactive statement to keep the 'tags' variable in sync with server data
	$: ({ tags } = data);

	// State for inline editing
	let editingId: number | null = null;
	let newTagName = '';

	// Reusable function to handle form actions (update, delete)
	// This ensures the page data reloads after a successful action.
	const handleAction = () => {
		return async ({ result }) => {
			if (result.type === 'success') {
				await invalidateAll(); // Reload all data from `load` functions
				editingId = null; // Exit editing mode on success
				if (result.data?.message) {
					alert(result.data.message); // Show success message
				}
			} else if (result.type === 'failure') {
				if (result.data?.message) {
					alert(`Error: ${result.data.message}`); // Show error message
				}
			}
		};
	};

	// Function to enter editing mode for a specific tag
	function startEditing(tag: (typeof tags)[0]) {
		editingId = tag.id;
		newTagName = tag.name;
	}

	// Function to cancel editing mode
	function cancelEditing() {
		editingId = null;
		newTagName = '';
	}
</script>

<svelte:head>
	<title>Tag Management</title>
</svelte:head>

<div class="container">
	<h1>Tag Management</h1>
	<p class="subtitle">Edit or delete manga tags.</p>

	<div class="tag-list">
		{#each tags as tag (tag.id)}
			<div class="tag-item">
				{#if editingId === tag.id}
					<!-- Editing View -->
					<form method="POST" action="?/updateTag" use:enhance={handleAction} class="edit-form">
						<input type="hidden" name="id" value={tag.id} />
						<input
							type="text"
							name="name"
							bind:value={newTagName}
							class="edit-input"
							aria-label="New tag name"
						/>
						<button type="submit" class="save-btn">Save</button>
						<button type="button" on:click={cancelEditing} class="cancel-btn">Cancel</button>
					</form>
				{:else}
					<!-- Display View -->
					<span class="tag-name">{tag.name}</span>
					<div class="actions">
						<button on:click={() => startEditing(tag)} class="edit-btn">Edit</button>
						<form method="POST" action="?/deleteTag" use:enhance={handleAction}>
							<input type="hidden" name="id" value={tag.id} />
							<button type="submit" class="delete-btn">Delete</button>
						</form>
					</div>
				{/if}
			</div>
		{/each}
	</div>

	{#if tags.length === 0}
		<p class="no-results">No tags found.</p>
	{/if}
</div>

<style>
	:root {
		--bg-primary: #1a1a1a;
		--bg-secondary: #242424;
		--bg-tertiary: #333333;
		--text-primary: #f0f0f0;
		--text-secondary: #b3b3b3;
		--border-color: #444;
		--accent-color: #6a8dff;
		--delete-color: #ff5252;
		--delete-hover: #ff1744;
	}

	.container {
		max-width: 800px;
		margin: 2rem auto;
		padding: 2rem;
		color: var(--text-primary);
	}

	h1 {
		font-size: 2rem;
		font-weight: 600;
		margin-bottom: 0.5rem;
	}

	.subtitle {
		color: var(--text-secondary);
		margin-bottom: 2rem;
	}

	.tag-list {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.tag-item {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 1rem;
		background-color: var(--bg-secondary);
		border: 1px solid var(--border-color);
		border-radius: 6px;
	}

	.tag-name {
		font-weight: 500;
	}

	.actions {
		display: flex;
		gap: 0.75rem;
	}

	.edit-form {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		width: 100%;
	}

	.edit-input {
		flex-grow: 1;
		background-color: var(--bg-primary);
		color: var(--text-primary);
		border: 1px solid var(--border-color);
		padding: 0.5rem 0.75rem;
		border-radius: 4px;
	}
	.edit-input:focus {
		outline: none;
		border-color: var(--accent-color);
	}

	button {
		padding: 0.5rem 1rem;
		border-radius: 4px;
		cursor: pointer;
		border: none;
		font-weight: 500;
		transition: background-color 0.2s ease;
	}

	.save-btn {
		background-color: var(--accent-color);
		color: white;
	}
	.save-btn:hover {
		background-color: #5577ee;
	}

	.edit-btn,
	.cancel-btn {
		background-color: var(--bg-tertiary);
		color: var(--text-primary);
	}
	.edit-btn:hover,
	.cancel-btn:hover {
		background-color: var(--border-color);
	}

	.delete-btn {
		background-color: var(--delete-color);
		color: white;
	}
	.delete-btn:hover {
		background-color: var(--delete-hover);
	}

	.no-results {
		text-align: center;
		padding: 2rem;
		color: var(--text-secondary);
	}
</style>