import { PartialType } from '@nestjs/swagger';
import { CreatePoolsSurveyDto } from './create-pools-survey.dto';

export class UpdatePoolsSurveyDto extends PartialType(CreatePoolsSurveyDto) {}
