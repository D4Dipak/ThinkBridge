CREATE PROCEDURE Get_Customers
@PageIndex int,
@PageSize int=10
AS
BEGIN
	--USING ROW NUMBER
	DECLARE @Start int = ((@PageIndex) * @PageSize) + 1
	DECLARE @End int = @Start + (@PageSize - 1)

	SELECT *FROM ((SELECT ROW_NUMBER() over(order by customerID) AS 'ROWID',*
					FROM Customers)) c
	WHERE c.ROWID between @Start and @End


	--USING FETCH AND OFFSET
	--	DECLARE @Start int = ((@PageIndex) * @PageSize)

	--	SELECT *FROM Customers
	--	order by customerID
	--	OFFSET @Start ROWS
	--	FETCH NEXT @PageSize ROWS only
END