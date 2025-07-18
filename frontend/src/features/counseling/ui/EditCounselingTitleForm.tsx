'use client';

/**
 * @file frontend/src/features/counseling/ui/EditCounselingTitleForm.tsx
 * 상담 세션 제목 수정 폼 컴포넌트입니다.
 * FSD 아키텍처에 따라 `features` 레이어의 `counseling` 슬라이스 내 `ui`에 위치합니다.
 */
import { useState, useCallback, useEffect } from 'react';
import { useUpdateCounselingTitle } from '@/entities/counseling/model/mutations';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { Label } from '@/shared/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '@/shared/ui/dialog';
import { useQueryClient } from '@tanstack/react-query';
import { counselingQueryKeys } from '@/entities/counseling/model/queries';

export interface EditCounselingTitleFormProps {
  /** 수정할 상담 세션의 ID */
  counsId: string;
  /** 현재 상담 세션의 제목 */
  currentTitle: string;
  /** 폼의 표시 여부를 제어하는 boolean 값 */
  isOpen: boolean;
  /** 폼 종료 핸들러 */
  onClose: () => void;
  /** 제목 수정 성공 후 실행할 콜백 함수 */
  onSuccess?: () => void;
}

/**
 * 상담 세션 제목을 수정하는 다이얼로그 폼 컴포넌트입니다.
 *
 * @param {EditCounselingTitleFormProps} props - 컴포넌트 props
 * @returns {React.ReactElement} EditCounselingTitleForm 컴포넌트
 */
const EditCounselingTitleForm = ({
  counsId,
  currentTitle,
  isOpen,
  onClose,
  onSuccess,
}: EditCounselingTitleFormProps): React.ReactElement => {
  // 상태 관리
  const [titleInput, setTitleInput] = useState(currentTitle);
  const queryClient = useQueryClient();

  // currentTitle prop이 변경되거나 _폼이 열릴 때_ titleInput 상태를 업데이트합니다.
  useEffect(() => {
    if (isOpen) {
      // 폼이 열려 있을 때만 동기화 (또는 필요시 isOpen 조건 없이 currentTitle 변경 시 항상 동기화)
      setTitleInput(currentTitle);
    }
  }, [currentTitle, isOpen]); // isOpen을 의존성에 추가하여 폼이 열릴 때마다 실행되도록 함

  // Tanstack Query 뮤테이션 훅 초기화
  const mutation = useUpdateCounselingTitle({
    onSuccess: (updatedSession, variables) => {
      // 캐시 무효화 먼저 실행
      queryClient.invalidateQueries({ queryKey: counselingQueryKeys.detail(variables.counsId) });
      queryClient.invalidateQueries({ queryKey: counselingQueryKeys.lists() });

      // 기존 로직 실행
      onSuccess?.();
      onClose();
    },
  });

  // 입력값 변경 핸들러
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setTitleInput(e.target.value);
  }, []);

  // 폼 제출 핸들러
  const handleSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const trimmedTitle = titleInput.trim();

      if (!trimmedTitle || trimmedTitle === currentTitle) {
        onClose();
        return;
      }

      mutation.mutate({
        counsId,
        payload: {
          counsTitle: trimmedTitle,
        },
      });
    },
    [counsId, currentTitle, titleInput, mutation, onClose]
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-soft-ivory border-primary">
        <DialogHeader>
          <DialogTitle className="text-foreground">상담 제목 수정</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="flex justify-center items-center gap-4">
              <Input
                id="counseling-title"
                value={titleInput}
                onChange={handleInputChange}
                className="w-3/4 border-primary focus:ring-primary bg-light-gray"
                disabled={mutation.isPending}
                autoFocus
              />
            </div>
          </div>
          {mutation.isError && (
            <div className="text-sm text-destructive mb-4">
              {mutation.error?.message || '제목 수정 중 오류가 발생했습니다.'}
            </div>
          )}
          <DialogFooter>
            <DialogClose asChild>
              <Button
                type="button"
                variant="outline"
                disabled={mutation.isPending}
                className="border-primary text-foreground hover:bg-light-gray"
              >
                취소
              </Button>
            </DialogClose>
            <Button
              type="submit"
              disabled={!titleInput.trim() || titleInput.trim() === currentTitle || mutation.isPending}
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              {mutation.isPending ? '저장 중...' : '저장'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditCounselingTitleForm;
