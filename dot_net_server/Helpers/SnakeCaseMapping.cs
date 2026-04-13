using System.Reflection;
using Dapper;

namespace dot_net_server.Helpers;

/// <summary>
/// Custom Dapper type mapper that maps PostgreSQL snake_case column names
/// to C# PascalCase property names.
/// e.g., "user_id" → UserId, "full_name" → FullName, "password_hash" → PasswordHash
/// </summary>
public class SnakeCaseTypeMapper : Dapper.SqlMapper.ITypeMap
{
    private readonly DefaultTypeMap _defaultMapper;

    public SnakeCaseTypeMapper(Type type)
    {
        _defaultMapper = new DefaultTypeMap(type);
    }

    public ConstructorInfo? FindConstructor(string[] names, Type[] types)
    {
        return _defaultMapper.FindConstructor(names, types);
    }

    public ConstructorInfo? FindExplicitConstructor()
    {
        return _defaultMapper.FindExplicitConstructor();
    }

    public SqlMapper.IMemberMap? GetConstructorParameter(ConstructorInfo constructor, string columnName)
    {
        return _defaultMapper.GetConstructorParameter(constructor, columnName);
    }

    public SqlMapper.IMemberMap? GetMember(string columnName)
    {
        // First try exact match
        var member = _defaultMapper.GetMember(columnName);
        if (member != null) return member;

        // Convert snake_case to PascalCase and try again
        var pascalCase = SnakeCaseToPascalCase(columnName);
        return _defaultMapper.GetMember(pascalCase);
    }

    private static string SnakeCaseToPascalCase(string snakeCase)
    {
        return string.Concat(
            snakeCase.Split('_')
                .Select(word => char.ToUpperInvariant(word[0]) + word[1..])
        );
    }
}

/// <summary>
/// Call SnakeCaseMapping.Apply() at startup to register the mapper for all models.
/// </summary>
public static class SnakeCaseMapping
{
    public static void Apply()
    {
        // Register all models for snake_case → PascalCase mapping
        var modelTypes = new[]
        {
            typeof(Models.User),
            typeof(Models.QuestionFile),
            typeof(Models.Question),
            typeof(Models.Category),
            typeof(Models.Subject),
            typeof(Models.Topic),
            typeof(Models.MicroTopic),
            typeof(Models.Tournament),
            typeof(Models.TournamentParticipant),
            typeof(Models.QuizSession),
            typeof(Models.QuizSessionQuestion),
            typeof(Models.NewsUpdate),
            typeof(Models.BugReport),
            typeof(Models.UserActivity),
        };

        foreach (var type in modelTypes)
        {
            SqlMapper.SetTypeMap(type, new SnakeCaseTypeMapper(type));
        }
    }
}