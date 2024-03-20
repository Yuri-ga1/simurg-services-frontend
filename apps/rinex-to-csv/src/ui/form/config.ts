import { type TranslateFunction } from '@repo/lib/i18next';
import { NavigationMeasurement, NavigationSystem, NavigationType, type TimeStep } from '../../api';

const timeSteps: TimeStep[] = [10, 30, 60, 120];

export const getTimeStepData = (t: TranslateFunction): { label: string; value: string }[] =>
  timeSteps.map((timeStep) => ({
    label: t('common.seconds', { value: timeStep }),
    value: `${timeStep}`,
  }));

export const navigationSystemMap: Record<NavigationType, NavigationSystem> = {
  [NavigationType.G_SIGNALS]: NavigationSystem.GPS,
  [NavigationType.R_SIGNALS]: NavigationSystem.GLONASS,
  [NavigationType.E_SIGNALS]: NavigationSystem.GALILEO,
  [NavigationType.C_SIGNALS]: NavigationSystem.BEI_DOU,
  [NavigationType.S_SIGNALS]: NavigationSystem.SBAS,
};

export const navigationMeasurementData = Object.values(NavigationMeasurement);

export const FILE_ACCEPT = '.rnx,.21o';
