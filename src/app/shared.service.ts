import { Injectable } from '@angular/core';
import { GoogleGenerativeAI, HarmBlockThreshold, HarmCategory } from '@google/generative-ai';
import { environment } from '../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  /**
   * Creates, configure with defaults, and returns the Google Gemini model from the SDK
   * @param model 'gemini-2.0' | 'gemini-2.0-flash'
   * @returns
   */
  initializeModel(model: 'gemini-2.0' | 'gemini-2.0-flash') {
    
    

  const googleGenerativeAI = new GoogleGenerativeAI(
    environment.googleAiApiKey
  );
  const generationConfig = {
    safetySettings: [
      {
        category: HarmCategory.HARM_CATEGORY_HARASSMENT,
        threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE,
      },
    ],
    temperature: 0.1,
    top_p: 1,
    top_k: 32,
    maxOutputTokens: 500, // limit output
  };
  return googleGenerativeAI.getGenerativeModel({
    model: model,
    ...generationConfig,
  });


  }
}