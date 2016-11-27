// general functions
export class Utils {
    public levelBound(level: number ): number {
        if (level > 99) {
            level = 99;
        }
        if (level < 0) {
            level = 0;
        }
        return Math.round(level);
    }
}