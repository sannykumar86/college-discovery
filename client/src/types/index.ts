export interface College {
  id: number;
  name: string;
  location: string;
  state: string;
  fees: number;
  rating: number;
  courses: string[];
  placement_percentage: number;
  established_year: number;
  type: string;
  description: string;
  image_url: string;
  website: string;
  avg_package: number;
  highest_package: number;
  total_students: number;
  accepted_exams: string[];
}

export interface Review {
  id: number;
  college_id: number;
  user_name: string;
  rating: number;
  title: string;
  content: string;
  created_at: string;
}

export interface CollegeDetail extends College {
  reviews: Review[];
  reviewStats: {
    count: number;
    avgRating: number;
  }
}

export interface SavedCollege extends College {
  saved_at: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface CollegeResponse {
  colleges: College[];
  pagination: Pagination;
}

export interface FiltersResponse {
  locations: string[];
  states: string[];
  types: string[];
  courses: string[];
  feesRange: {
    minFees: number;
    maxFees: number;
  };
}
