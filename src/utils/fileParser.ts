import * as XLSX from 'xlsx';
import { Dataset } from '../types/dataset';
import {
  profileDataset,
  detectAnomalies,
  assessDataQuality,
  inferSchemaHeuristics,
} from './dataEngine';
import { requestSchemaInference } from '../services/api';

/**
 * Parse an uploaded CSV or Excel file into a verified Dataset object
 */
export async function parseUploadedFile(
  file: File,
  onProgress?: (step: number) => void
): Promise<Dataset> {
  onProgress?.(0); // 1. Reading file

  const arrayBuffer = await file.arrayBuffer();
  const workbook = XLSX.read(arrayBuffer, { type: 'array', cellDates: true });
  const firstSheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[firstSheetName];

  // Convert to JSON
  const rawData: Record<string, any>[] = XLSX.utils.sheet_to_json(worksheet, {
    defval: null,
    raw: false,
    dateNF: 'yyyy-mm-dd',
  });

  if (!rawData || rawData.length === 0) {
    throw new Error('The uploaded file does not contain any readable records.');
  }

  // Clean and sanitize column headers
  const sampleRaw = rawData[0];
  const originalKeys = Object.keys(sampleRaw);
  const sanitizedRecords: Record<string, any>[] = rawData.map((row) => {
    const cleanRow: Record<string, any> = {};
    originalKeys.forEach((key, idx) => {
      const cleanKey = key.trim() || `Column_${idx + 1}`;
      cleanRow[cleanKey] = row[key];
    });
    return cleanRow;
  });

  onProgress?.(1); // 2. Detecting columns & types
  const { columns, profiles } = profileDataset(sanitizedRecords);

  onProgress?.(2); // 3. Anomaly detection & Quality Assessment
  const anomalies = detectAnomalies(sanitizedRecords, profiles);
  const quality = assessDataQuality(sanitizedRecords, profiles, anomalies);

  onProgress?.(3); // 4. Semantic Schema Inference (Heuristics fallback first)
  const initialSchema = inferSchemaHeuristics(columns, profiles);

  onProgress?.(4); // 5. Upgrade schema with AI inference if available
  let finalSchema = initialSchema.inferredSchema;
  let finalSuggested = initialSchema.suggestedQuestions;

  try {
    const aiInference = await requestSchemaInference(
      columns,
      profiles,
      sanitizedRecords.slice(0, 5)
    );
    if (aiInference && aiInference.inferredSchema) {
      finalSchema = { ...finalSchema, ...aiInference.inferredSchema };
      if (aiInference.suggestedQuestions?.length > 0) {
        finalSuggested = aiInference.suggestedQuestions;
      }
    }
  } catch (err) {
    console.warn('AI schema inference failed, relying on dynamic heuristic profiling:', err);
  }

  return {
    id: `dataset-${Date.now()}`,
    name: file.name.replace(/\.[^/.]+$/, ''),
    fileName: file.name,
    records: sanitizedRecords,
    columns,
    profiles,
    inferredSchema: finalSchema,
    quality,
    anomalies,
    suggestedQuestions: finalSuggested,
    uploadedAt: new Date().toISOString(),
  };
}
