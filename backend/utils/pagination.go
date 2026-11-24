package utils

import (
	"math"
	"strconv"

	"github.com/gin-gonic/gin"
)

// PaginationParams holds page and limit values.
type PaginationParams struct {
	Page  int
	Limit int
	Skip  int
}

// PaginationMeta is returned in list responses.
type PaginationMeta struct {
	Total       int64 `json:"total"`
	Page        int   `json:"page"`
	Limit       int   `json:"limit"`
	TotalPages  int   `json:"total_pages"`
	HasNextPage bool  `json:"has_next_page"`
	HasPrevPage bool  `json:"has_prev_page"`
}

// GetPagination extracts and validates pagination query params.
func GetPagination(c *gin.Context) PaginationParams {
	page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
	limit, _ := strconv.Atoi(c.DefaultQuery("limit", "10"))

	if page < 1 {
		page = 1
	}
	if limit < 1 || limit > 100 {
		limit = 10
	}

	return PaginationParams{
		Page:  page,
		Limit: limit,
		Skip:  (page - 1) * limit,
	}
}

// BuildMeta constructs the pagination meta object.
func BuildMeta(total int64, p PaginationParams) PaginationMeta {
	totalPages := int(math.Ceil(float64(total) / float64(p.Limit)))
	return PaginationMeta{
		Total:       total,
		Page:        p.Page,
		Limit:       p.Limit,
		TotalPages:  totalPages,
		HasNextPage: p.Page < totalPages,
		HasPrevPage: p.Page > 1,
	}
}
