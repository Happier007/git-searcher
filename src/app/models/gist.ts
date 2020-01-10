import { IOwner } from '@models/owner';

export interface IGist {
    url: string;
    forks_url: string;
    commits_url: string;
    id: string;
    node_id: string;
    git_pull_url: string;
    git_push_url: string;
    html_url: string;
    files: IFiles;
    public: boolean;
    created_at: string;
    updated_at: string;
    description: string;
    comments: number;
    user: string;
    comments_url: string;
    owner: IOwner;
    truncated: boolean;
}

export interface IFiles {
    filename: string;
    type: string;
    language: string;
    raw_url: string;
    size: number;
}
