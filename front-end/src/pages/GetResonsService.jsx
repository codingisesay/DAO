
    const fetchData = async () => {
        try {
            setLoading(true);
            const response = await adminService.getAllReviewApplications({
                page: currentPage,
                sort: sortConfig.field ? `${sortConfig.field},${sortConfig.order}` : "",
                ...filters,
            });
            
            // Process the data to include all review comments
            const processedData = response.data ? response.data.map(item => ({
                ...item,
                review_comments: getReviewComments(item)
            })) : [];
            
            setTbldata(processedData);
            setData({ content: processedData });
        } catch (error) {
            console.error("Failed to fetch review applications:", error);
        } finally {
            setLoading(false);
        }
    };
  