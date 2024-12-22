import { Test, TestingModule } from '@nestjs/testing';
import { SurveysService } from './surveys.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSurveyDto } from './dto/create-survey.dto';
import { UpdateSurveyDto } from './dto/update-survey.dto';
import { $Enums, Survey } from '@prisma/client';
import { VotesService } from '../votes/votes.service';

describe('SurveysService', () => {
  let service: SurveysService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        VotesService,
        SurveysService,
        {
          provide: PrismaService,
          useValue: {
            survey: {
              create: jest.fn(),
              findMany: jest.fn(),
              findUniqueOrThrow: jest.fn(),
              update: jest.fn(),
              delete: jest.fn(),
            },
            vote: {
              findMany: jest.fn(),
            }
          },
        },
      ],
    }).compile();

    service = module.get<SurveysService>(SurveysService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  const surveyExampleDto: CreateSurveyDto = { userId: 1, title: 'Test Survey', description: 'Test Description', category: $Enums.SurveyCategory.CATEGORY_1, image: 'image' };
  const surveyExample: Survey = { id: 1, createdAt: new Date(), updatedAt: new Date(), ...surveyExampleDto };

  it('should create a survey', async () => {
    jest.spyOn(prismaService.survey, 'create').mockResolvedValue(surveyExample);
    expect(await service.create(surveyExampleDto)).toEqual(surveyExample);
  });

  it('should return all surveys', async () => {
    const surveys: Survey[] = [surveyExample];
    jest.spyOn(prismaService.survey, 'findMany').mockResolvedValue(surveys);
    expect(await service.findAll()).toEqual(surveys);
  });

  it('should return a single survey', async () => {
    const survey: Survey = surveyExample;
    jest.spyOn(prismaService.survey, 'findUniqueOrThrow').mockResolvedValue(survey);
    expect(await service.findOne(1)).toEqual(survey);
  });

  it('should update a survey', async () => {
    const updateSurveyDto: UpdateSurveyDto = { ...surveyExampleDto };
    jest.spyOn(prismaService.survey, 'update').mockResolvedValue(surveyExample);
    expect(await service.update(1, updateSurveyDto)).toEqual(surveyExample);
  });

  it('should delete a survey', async () => {
    const survey: Survey = surveyExample;
    jest.spyOn(prismaService.survey, 'delete').mockResolvedValue(survey);
    expect(await service.remove(1)).toEqual(survey);
  });
});
