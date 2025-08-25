export interface E22ClassificationProps {
    isAdmin?: boolean;
}

export interface KeyFeature {
    _id?: string;
    title: string;
    description: string;
}
  
export interface ImportanceParagraph {
    _id?: string;
    paragraph: string;
}
  
export interface E22OverviewData {
    _id: string;
    mainTitle: string;
    mainDescription: string;
    featuresTitle: string;
    keyFeatures: KeyFeature[];
    importanceTitle: string;
    importanceDescription: ImportanceParagraph[];
    lastUpdated?: Date;
    updatedBy?: string;
}
