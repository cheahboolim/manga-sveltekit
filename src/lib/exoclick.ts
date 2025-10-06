// ExoClick tracking utilities
const TRACKING_TOKEN_KEY = 'exoclick_tracking_token'
const TRACKING_STORAGE_DURATION = 24 * 60 * 60 * 1000 // 24 hours in milliseconds

export interface TrackingData {
	token: string
	timestamp: number
}

/**
 * Capture and store ExoClick tracking token from URL parameters
 */
export function captureTrackingToken(): void {
	try {
		const urlParams = new URLSearchParams(window.location.search)
		const token = urlParams.get('tag') // ExoClick uses 'tag' parameter

		if (token && token.trim()) {
			const trackingData: TrackingData = {
				token: token.trim(),
				timestamp: Date.now()
			}

			localStorage.setItem(TRACKING_TOKEN_KEY, JSON.stringify(trackingData))
			console.log('ExoClick tracking token captured:', token)
		}
	} catch (error) {
		console.error('Error capturing ExoClick tracking token:', error)
	}
}

/**
 * Get stored tracking token if it exists and hasn't expired
 */
export function getTrackingToken(): string | null {
	try {
		const stored = localStorage.getItem(TRACKING_TOKEN_KEY)
		if (!stored) return null

		const trackingData: TrackingData = JSON.parse(stored)
		const now = Date.now()

		// Check if token has expired
		if (now - trackingData.timestamp > TRACKING_STORAGE_DURATION) {
			localStorage.removeItem(TRACKING_TOKEN_KEY)
			return null
		}

		return trackingData.token
	} catch (error) {
		console.error('Error retrieving ExoClick tracking token:', error)
		return null
	}
}

/**
 * Clear stored tracking token
 */
export function clearTrackingToken(): void {
	localStorage.removeItem(TRACKING_TOKEN_KEY)
}