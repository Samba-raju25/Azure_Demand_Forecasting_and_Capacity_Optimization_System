/**
 * API Service Module
 * Centralized service for all backend API calls
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

/**
 * Generic fetch wrapper with error handling
 */
const apiFetch = async (endpoint, options = {}) => {
    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers,
            },
            ...options,
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.error || `HTTP Error ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error(`API Error [${endpoint}]:`, error);
        throw error;
    }
};

/**
 * API Service Object
 */
const api = {
    // Health check
    getHealth: () => apiFetch('/'),

    // Model metadata
    getMetrics: () => apiFetch('/api/metrics'),

    // Forecast endpoints
    getForecast7Days: (region = 'East') =>
        apiFetch(`/api/forecast_7?region=${encodeURIComponent(region)}`),

    getForecast30Days: (region = 'East') =>
        apiFetch(`/api/forecast_30?region=${encodeURIComponent(region)}`),

    // Capacity planning
    getCapacityPlanning: (capacity, forecastDays = 7) =>
        apiFetch('/api/capacity_planning', {
            method: 'POST',
            body: JSON.stringify({ capacity, forecast_days: forecastDays }),
        }),

    // Optimization suggestions
    getOptimization: (capacity, forecastDays = 1, region = 'unknown') =>
        apiFetch('/api/optimization', {
            method: 'POST',
            body: JSON.stringify({ capacity, forecast_days: forecastDays, region }),
        }),

    // Model monitoring and health
    getMonitoring: (mape = null) => {
        const params = mape ? `?mape=${mape}` : '';
        return apiFetch(`/api/monitoring${params}`);
    },

    // Comprehensive report
    getReport: (capacity = 10000, mape = 8.5) =>
        apiFetch(`/api/report?capacity=${capacity}&mape=${mape}`),

    // Multi-region comparison
    getMultiRegion: (regions = 'East US,West US,North Europe,Southeast Asia') =>
        apiFetch(`/api/multi_region?regions=${encodeURIComponent(regions)}`),

    // Chat assistant
    sendChatMessage: (message, systemInstruction = '') =>
        apiFetch('/api/chat', {
            method: 'POST',
            body: JSON.stringify({
                message,
                system_instruction: systemInstruction
            }),
        }),

    // Single CPU prediction
    predictCPU: (inputData) =>
        apiFetch('/api/predict_cpu', {
            method: 'POST',
            body: JSON.stringify(inputData),
        }),
};

export default api;
