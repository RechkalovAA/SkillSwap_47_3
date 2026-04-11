import type { ReactNode } from 'react';
import styles from './CatalogPage.module.css';

interface CatalogFiltersPanelProps {
  children?: ReactNode;
}

/**
 * Компонент-обертка для панели фильтров каталога.
 * Предназначен для интеграции с готовыми контролами из F-3.3-2.
 *
 * @example
 * // После подключения реальных фильтров:
 * <CatalogFiltersPanel>
 *   <RealFiltersComponent
 *     filters={filters}
 *     onChange={handleFilterChange}
 *   />
 * </CatalogFiltersPanel>
 */
export function CatalogFiltersPanel({ children }: CatalogFiltersPanelProps) {
  return (
    <div className={styles.filtersPanel}>
      {children ?? (
        <div className={styles.filtersPlaceholder}>
          <p className={styles.placeholderText}>
            Фильтры будут подключены из F-3.3-2
          </p>
          <p className={styles.placeholderHint}>
            Сюда встанут контролы: RadioGroup, CheckboxGroup, селекты
          </p>
        </div>
      )}
    </div>
  );
}
