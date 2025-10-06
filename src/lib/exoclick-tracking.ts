// ExoClick conversion tracking utilities
import { getTrackingToken } from './exoclick'

const EXOCLICK_GOAL_ID = 'ce4c5732ec94917f96fd0cc7e6162ccf'
const TRACKING_BASE_URL = 'http://s.magsrv.com/tag.php'

export enum ConversionType {
	USER_REGISTRATION = 'user_registration',
	CONTENT_CONSUMPTION = 'content_consumption',
	PREMIUM_SUBSCRIPTION = 'premium_subscription',
	PAGE_VIEW = 'page_view',
	TIME_SPENT = 'time_spent'
}

export const CONVERSION_VALUES: Record<ConversionType, number> = {
	[ConversionType.USER_REGISTRATION]: 0.50, // $0.50 for PWA app installation (low-balled)
	[ConversionType.CONTENT_CONSUMPTION]: 0.01, // $0.01 for reading manga (low-balled)
	[ConversionType.PREMIUM_SUBSCRIPTION]: 10.00, // $10.00 for premium subscription
	[ConversionType.PAGE_VIEW]: 0.01, // $0.01 for page view (low-balled)
	[ConversionType.TIME_SPENT]: 0.03 // $0.03 for significant time spent (low-balled)
}

/**
 * Track a conversion event
 */
export async function trackConversion(
	conversionType: ConversionType,
	customValue?: number
): Promise<boolean> {
	try {
		const token = getTrackingToken()
		if (!token) {
			console.log('No ExoClick tracking token found, skipping conversion tracking')
			return false
		}

		const value = customValue ?? CONVERSION_VALUES[conversionType]

		const trackingUrl = `${TRACKING_BASE_URL}?goal=${EXOCLICK_GOAL_ID}&tag=${encodeURIComponent(token)}&value=${value}`

		console.log(`Tracking ExoClick conversion: ${conversionType} with value $${value}`)

		// Make the tracking request
		const response = await fetch(trackingUrl, {
			method: 'GET',
			mode: 'no-cors' // ExoClick tracking doesn't return CORS headers
		})

		console.log('ExoClick conversion tracked successfully')
		return true
	} catch (error) {
		console.error('Error tracking ExoClick conversion:', error)
		return false
	}
}

/**
 * Track user registration conversion
 */
export function trackUserRegistration(): Promise<boolean> {
	return trackConversion(ConversionType.USER_REGISTRATION)
}

/**
 * Track content consumption (reading manga)
 */
export function trackContentConsumption(): Promise<boolean> {
	return trackConversion(ConversionType.CONTENT_CONSUMPTION)
}

/**
 * Track premium subscription
 */
export function trackPremiumSubscription(): Promise<boolean> {
	return trackConversion(ConversionType.PREMIUM_SUBSCRIPTION)
}

/**
 * Track page view
 */
export function trackPageView(): Promise<boolean> {
	return trackConversion(ConversionType.PAGE_VIEW)
}

/**
 * Track significant time spent on site
 */
export function trackTimeSpent(): Promise<boolean> {
	return trackConversion(ConversionType.TIME_SPENT)
}