// src/lib/r2.js
import { S3Client, DeleteObjectCommand, ListObjectsV2Command, DeleteObjectsCommand } from '@aws-sdk/client-s3';
import { R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET, R2_ENDPOINT } from '$env/static/private';

export const r2Client = new S3Client({
	region: 'auto',
	endpoint: R2_ENDPOINT,
	credentials: {
		accessKeyId: R2_ACCESS_KEY_ID,
		secretAccessKey: R2_SECRET_ACCESS_KEY
	}
});

export async function deleteR2Object(key) {
	try {
		const command = new DeleteObjectCommand({
			Bucket: R2_BUCKET,
			Key: key
		});
		await r2Client.send(command);
		return { success: true };
	} catch (error) {
		console.error('Error deleting R2 object:', error);
		return { success: false, error: error.message };
	}
}

export async function deleteR2Objects(keys) {
	try {
		if (keys.length === 0) return { success: true };
		
		const command = new DeleteObjectsCommand({
			Bucket: R2_BUCKET,
			Delete: {
				Objects: keys.map(key => ({ Key: key })),
				Quiet: false
			}
		});
		
		const result = await r2Client.send(command);
		return { 
			success: true, 
			deleted: result.Deleted,
			errors: result.Errors 
		};
	} catch (error) {
		console.error('Error deleting R2 objects:', error);
		return { success: false, error: error.message };
	}
}

export async function listR2Objects(prefix) {
	try {
		const command = new ListObjectsV2Command({
			Bucket: R2_BUCKET,
			Prefix: prefix
		});
		
		const result = await r2Client.send(command);
		return {
			success: true,
			objects: result.Contents || []
		};
	} catch (error) {
		console.error('Error listing R2 objects:', error);
		return { success: false, error: error.message };
	}
}