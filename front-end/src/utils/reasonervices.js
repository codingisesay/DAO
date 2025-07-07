// src/services/dataService.js

import { agentService } from '../services/apiServices'; // Assuming apiServices exports agentService

const dataService = {
    fetchReasonById: async (id) => {
        if (!id) {
            console.warn("No ID provided to fetchReasonById.");
            return null; // Or throw an error, depending on desired behavior
        }
        try {
            const response = await agentService.refillApplication(id);
            return response.data[0];
        } catch (error) {
            console.error("Failed to fetch reason for application ID:", id, error);
            throw error; // Re-throw to allow the calling component to handle it
        }
    }
    // You can add more common data fetching functions here
};

export default dataService;