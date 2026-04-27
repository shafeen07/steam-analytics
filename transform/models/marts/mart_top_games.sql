with games as (
    select * from {{ ref('dim_games') }}
),

final as (
    select
        app_id,
        name,
        developer,
        is_free,
        price_usd,
        current_players,
        positive_pct,
        review_sentiment,
        owners,
        avg_playtime_hrs,
        header_image,
        metacritic_score
    from games
    where current_players > 0
    order by current_players desc
    limit 200
)

select * from final