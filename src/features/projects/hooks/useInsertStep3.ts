import { useState } from "react";

import { useSnackbarStore } from "@shared/stores/snackbarStore";
import { type ProjectItemInsertReq } from "@shared/types/project";
import {
  NewSchedulePeriod,
  type ProjectSchedule,
} from "@shared/types/schedule";

type Step3Type = Pick<ProjectItemInsertReq, "description" | "schedules">;

interface ApplyFormResult {
  formStep3: Step3Type;
  onChangeForm: (
    field: keyof Step3Type,
    value: Step3Type[keyof Step3Type]
  ) => void;
  validateForm: () => boolean;
}

const useInsertStep3 = ({ state }: { state?: Step3Type }): ApplyFormResult => {
  const isModify = !!state; // 추후에 수정을 위해서
  const { showError } = useSnackbarStore();

  const [formStep3, setFormStep3] = useState(isModify ? state : initForm3);

  const handleChangeStep3 = (
    field: keyof Step3Type,
    value: Step3Type[keyof Step3Type]
  ): void => {
    setFormStep3((prev) => ({ ...prev, [field]: value }));
  };

  const validateForm = (): boolean => {
    if (!formStep3.description.trim()) {
      showError("프로젝트 상세 설명을 작성해주세요");
      return false;
    }
    if (formStep3.schedules.length === 0) {
      showError("최소 1개 이상의 프로젝트 일정을 추가해주세요");
      return false;
    }

    for (let i = 0; i < formStep3.schedules.length; i++) {
      const schedule = formStep3.schedules[i];
      const scheduleNum = i + 1;

      if (!schedule.stageName.trim()) {
        showError(`${scheduleNum}번째 일정의 단계명을 입력해주세요`);
        return false;
      }

      if (!schedule.description.trim()) {
        showError(`${scheduleNum}번째 일정의 설명을 입력해주세요`);
        return false;
      }

      if (!schedule.period) {
        showError(`${scheduleNum}번째 일정의 예상 기간을 선택해주세요`);
        return false;
      }
    }
    return true;
  };

  return {
    formStep3,
    onChangeForm: handleChangeStep3,
    validateForm,
  };
};

export default useInsertStep3;

const initSchedule: ProjectSchedule = {
  stageName: "",
  period: NewSchedulePeriod.oneWeek,
  description: "",
};

const initForm3: Step3Type = {
  description: "",
  schedules: [initSchedule],
};
