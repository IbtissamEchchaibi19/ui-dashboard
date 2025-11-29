import React, { useState } from 'react';
import { DropDownListComponent } from '@syncfusion/ej2-react-dropdowns';
import { ButtonComponent } from '@syncfusion/ej2-react-buttons';
import { DialogComponent } from '@syncfusion/ej2-react-popups';
import { CheckBoxComponent } from '@syncfusion/ej2-react-buttons';

// Generic filter configuration
export interface FilterOption<T = string> {
  label: string;
  value: T;
}

export interface FilterConfig<T = string> {
  id: string;
  label: string;
  options: FilterOption<T>[];
  selected: T[];
}

// Props interface with generics
interface FiltersBarProps<TEntity, TFilters> {
  // View dropdown
  viewLabel?: string;
  viewOptions?: Array<{ text: string; value: string }>;
  selectedView?: string;
  onViewChange?: (value: string) => void;
  
  // Entity dropdown (Campaigns, Ad Groups, etc.)
  entityLabel?: string;
  entities: TEntity[];
  getEntityDisplay: (entity: TEntity) => string;
  getEntityValue: (entity: TEntity) => string;
  selectedEntityId: string | null;
  onEntityChange: (entityId: string) => void;
  
  // Filters configuration
  filters: FilterConfig[];
  onFiltersChange: (filters: FilterConfig[]) => void;
  
  // Save button
  showSaveButton?: boolean;
  onSave?: () => void;
}

export function FiltersBar<TEntity, TFilters>({
  viewLabel = 'View',
  viewOptions = [{ text: 'All', value: 'all' }],
  selectedView = 'all',
  onViewChange,
  
  entityLabel = 'Items',
  entities,
  getEntityDisplay,
  getEntityValue,
  selectedEntityId,
  onEntityChange,
  
  filters,
  onFiltersChange,
  
  showSaveButton = true,
  onSave
}: FiltersBarProps<TEntity, TFilters>) {
  const [showFilterDialog, setShowFilterDialog] = useState(false);
  const [localFilters, setLocalFilters] = useState<FilterConfig[]>(filters);

  // Calculate active filter count
  const activeFilterCount = filters.reduce((count, filter) => count + filter.selected.length, 0);

  // Convert entities to dropdown format
  const entityOptions = entities.map(entity => ({
    text: getEntityDisplay(entity),
    value: getEntityValue(entity)
  }));

  const handleFilterToggle = (filterId: string, value: string, checked: boolean) => {
    setLocalFilters(prev => prev.map(filter => {
      if (filter.id === filterId) {
        return {
          ...filter,
          selected: checked
            ? [...filter.selected, value]
            : filter.selected.filter(v => v !== value)
        };
      }
      return filter;
    }));
  };

  const applyFilters = () => {
    onFiltersChange(localFilters);
    setShowFilterDialog(false);
  };

  const removeFilterValue = (filterId: string, value: string) => {
    const updatedFilters = filters.map(filter => {
      if (filter.id === filterId) {
        return {
          ...filter,
          selected: filter.selected.filter(v => v !== value)
        };
      }
      return filter;
    });
    
    onFiltersChange(updatedFilters);
  };

  return (
    <>
      {/* Top Bar with Dropdowns */}
      <div className="border-b border-gray-200 bg-white">
        <div className="px-4 py-2.5 flex items-center gap-3">
          {/* View Dropdown */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-600">{viewLabel} ({activeFilterCount} filter{activeFilterCount !== 1 ? 's' : ''})</span>
            <DropDownListComponent
              dataSource={viewOptions}
              fields={{ text: 'text', value: 'value' }}
              value={selectedView}
              change={(e) => onViewChange && onViewChange(e.value)}
              cssClass="e-outline"
              popupHeight="250px"
            />
          </div>

          {/* Entity Dropdown */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-600">{entityLabel} ({entities.length})</span>
            <DropDownListComponent
              dataSource={entityOptions}
              fields={{ text: 'text', value: 'value' }}
              placeholder={`Select a ${entityLabel.toLowerCase().slice(0, -1)}`}
              value={selectedEntityId}
              change={(e) => onEntityChange(e.value)}
              cssClass="e-outline"
              popupHeight="250px"
            />
          </div>

          {/* Spacer */}
          <div className="flex-1"></div>

          {/* Save Button */}
          {showSaveButton && (
            <ButtonComponent 
              iconCss="e-icons e-save"
              cssClass="e-flat e-small"
              onClick={onSave}
            >
              Save
            </ButtonComponent>
          )}
        </div>
      </div>

      {/* Filters Chips Bar */}
      <div className="bg-gray-50 border-b border-gray-200 px-4 py-2.5">
        <div className="flex items-center gap-3 text-xs flex-wrap">
          <span className="text-gray-700 font-medium">Filters</span>
          
          {/* Display active filters */}
          {filters.map(filter => (
            <div key={filter.id} className="flex items-center gap-2">
              <span className="text-gray-600">{filter.label}:</span>
              {filter.selected.length > 0 ? (
                filter.selected.map(value => (
                  <span key={value} className="inline-flex items-center gap-1 px-2 py-1 bg-white border border-gray-300 rounded text-gray-700">
                    {value}
                    <button 
                      onClick={() => removeFilterValue(filter.id, value)}
                      className="text-gray-400 hover:text-gray-600 text-base leading-none"
                    >
                      ×
                    </button>
                  </span>
                ))
              ) : (
                <span className="text-gray-600">All</span>
              )}
            </div>
          ))}

          {/* Add Filter Button */}
          <ButtonComponent 
            cssClass="e-link e-small text-blue-600"
            onClick={() => {
              setLocalFilters(filters);
              setShowFilterDialog(true);
            }}
          >
            Add filter
          </ButtonComponent>
        </div>
      </div>

      {/* Filter Dialog */}
      <DialogComponent
        width="480px"
        isModal={true}
        visible={showFilterDialog}
        close={() => setShowFilterDialog(false)}
        header="Add Filter"
        showCloseIcon={true}
        footerTemplate={() => (
          <div className="flex justify-end gap-2 p-3">
            <ButtonComponent 
              cssClass="e-flat"
              onClick={() => setShowFilterDialog(false)}
            >
              Cancel
            </ButtonComponent>
            <ButtonComponent 
              cssClass="e-primary"
              onClick={applyFilters}
            >
              Apply
            </ButtonComponent>
          </div>
        )}
      >
        <div className="p-4 space-y-5">
          {localFilters.map(filter => (
            <div key={filter.id}>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {filter.label}
              </label>
              <div className="space-y-2">
                {filter.options.map(option => (
                  <div key={option.value} className="flex items-center">
                    <CheckBoxComponent
                      label={option.label}
                      checked={localFilters.find(f => f.id === filter.id)?.selected.includes(option.value)}
                      change={(e) => handleFilterToggle(filter.id, option.value, e.checked)}
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </DialogComponent>
    </>
  );
}