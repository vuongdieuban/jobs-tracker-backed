import { ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';
import { PositionOption, PositionTopOrBottomType } from '../types';

@ValidatorConstraint({ name: 'customText', async: false })
export class PositionValidator implements ValidatorConstraintInterface {
  validate(position: PositionOption) {
    if (!(typeof position === 'string' || typeof position === 'number')) {
      return false;
    }

    if (typeof position === 'string') {
      return PositionTopOrBottomType.includes(position);
    }

    return true;
  }

  defaultMessage() {
    return 'position can only be "top" | "bottom" | number';
  }
}
