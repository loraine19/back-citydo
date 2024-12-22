import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../../src/prisma/prisma.service';
import { SurveysController } from '../surveys/surveys.controller';
import { SurveysService } from '../surveys/surveys.service';
import { CreateSurveyDto } from './dto/create-survey.dto';
import { UpdateSurveyDto } from './dto/update-survey.dto';
import { $Enums, Survey } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';
import { RequestWithUser } from '../auth/auth.entities/auth.entity';

describe('SurveysController', () => {
  let controller: SurveysController;
  let service: SurveysService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SurveysController],
      providers: [
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn().mockReturnValue('mockToken'),
            verifyAsync: jest.fn().mockResolvedValue({ sub: 1 }),
          },
        },
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
          },
        },
      ],
    }).compile();

    controller = module.get<SurveysController>(SurveysController);
    service = module.get<SurveysService>(SurveysService);
  });

  const surveyExampleDto: CreateSurveyDto = { userId: 1, title: 'Test Survey', description: 'Test Description', category: $Enums.SurveyCategory.CATEGORY_1, image: 'image' };
  const surveyExample: Survey = { id: 1, createdAt: new Date(), updatedAt: new Date(), ...surveyExampleDto };

  it('should create a survey', async () => {
    jest.spyOn(service, 'create').mockResolvedValue(surveyExample);
    expect(await controller.create(surveyExampleDto, null)).toEqual(surveyExample);
  });

  it('should return all surveys', async () => {
    const surveys: Survey[] = [surveyExample];
    jest.spyOn(service, 'findAll').mockResolvedValue(surveys);
    expect(await controller.findAll()).toEqual(surveys);
  });

  it('should return all my surveys', async () => {
    const surveys: Survey[] = [surveyExample];
    jest.spyOn(service, 'findAllByUserId').mockResolvedValue(surveys);
    const req = { user: { sub: 1 } } as RequestWithUser;
    expect(await controller.findMines(req)).toEqual(surveys);
  });

  it('should return all surveys by user', async () => {
    const surveys: Survey[] = [surveyExample];
    jest.spyOn(service, 'findAllByUserId').mockResolvedValue(surveys);
    expect(await controller.findAllByUserId(1)).toEqual(surveys);
  });

  it('should return a single survey', async () => {
    const survey: Survey = surveyExample;
    jest.spyOn(service, 'findOne').mockResolvedValue(survey);
    expect(await controller.findOne(1)).toEqual(survey);
  });

  it('should update a survey', async () => {
    const updateSurveyDto: UpdateSurveyDto = { ...surveyExampleDto };
    jest.spyOn(service, 'update').mockResolvedValue(surveyExample);
    expect(await controller.update(1, updateSurveyDto, null)).toEqual(surveyExample);
  });

  it('should delete a survey', async () => {
    const survey: Survey = surveyExample;
    jest.spyOn(service, 'remove').mockResolvedValue(survey);
    expect(await controller.remove(1)).toEqual(survey);
  });
});
