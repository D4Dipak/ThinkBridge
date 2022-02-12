CREATE FUNCTION [dbo].[GetBirthDayFromDate](@CustomerBirthDate datetime)
RETURNS int
AS
BEGIN
	DECLARE @customDate DATETIME;
	IF(MONTH(@CustomerBirthDate) > MONTH(GETDATE()))
	BEGIN
		SET @customDate = datefromparts(YEAR(GETDATE()),MONTH(@CustomerBirthDate),DAY(@CustomerBirthDate))
	END
	ELSE
	BEGIN
		IF(DAY(GETDATE()) <= DAY(@CustomerBirthDate))
		BEGIN
			SET @customDate = datefromparts(YEAR(GETDATE()),MONTH(@CustomerBirthDate),DAY(@CustomerBirthDate))
		END
		ELSE
		BEGIN
			SET @customDate = datefromparts(YEAR(GETDATE())+1,MONTH(@CustomerBirthDate),DAY(@CustomerBirthDate))
		END
	END
	RETURN DATEDIFF(DAY, GETDATE(), @customDate)
END












